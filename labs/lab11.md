# Lab: Orchestrating ML training and Inference with Kubernetes
In this lab you will:
 - Leverage Kubernetes to enable continuous model training and inference
 - Distribute traffic across multiple replicas of the backend inference service
 - And experiment with [container lifecycle hooks](https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/) in Kubernetes.



## Deliverables

- [ ] Show the TA that you are continuously training a model using Kubernetes CronJobs
- [ ] Show the TA that inference requests are being distributed across multiple backend replicas. Explain to the TA how Kubernetes routes requests across multiple replicas in a service.
- [ ] Demonstrate an effective use of the `preStop` container lifecycle hook to the TA. Explain the graceful shutdown sequence to the TA and describe one practical use case for lifecycle hooks.



## Getting Started
1. **Sign up for Docker**: If you don't already, ensure you have an account at [docker.com](https://www.docker.com/), so you can push images to the docker registry.
2. **Start Docker**: Ensure Docker is running on your machine.
3. **Fork Repo**: Fork the repo [here](https://github.com/mlip-cmu/mlip-kubernetes-lab) 
4. **Install MiniKube**: Follow instructions [here](https://minikube.sigs.k8s.io/docs/start/).
5. **Start MiniKube**: Start MiniKube on your local setup. Run `minikube start`.
6. **Verify MiniKube**: Confirm that MiniKube is running by listing all pods:

```
kubectl get po -A
```

## Task 1: Implement continuous training 
1. In `model_trainer.py` implement the code to train the model given training data `X` and labels `Y`
2. Push your model training image. For details on how to do that, see [Build and Push the Docker Image](./README.md#build-and-push-the-docker-image)
3. In `trainer_deployment.yaml` configure the cron so that the model training runs at a periodic interval (for demonstration purposes keep it fairly frequent; every 1-2 minutes)  
```
kubectl apply -f trainer-deployment.yaml
```
At this point, you should be able to see the continuously running training `model-trainer-job` CronJob using the Minikube dashboard. For instructions on doing that see [Troubleshooting](#troubleshooting).

Alternatively, you should be able to verify this using the kubectl cli:
```
kubectl get jobs # this should output a list of your most recent jobs
kubectl logs -f job/<trainer-job-id>

```

## Task 2: Implement the Backend Inference Service 
1. In `backend.py` implement the code changes to predict based on 
2. Push your backend image to the Docker registry. For details on how to do that, see [Build and Push the Docker Image](./README.md#build-and-push-the-docker-image)

3. At this point, you should be able to verify that you can reach and can see the inference happening on distributed backend. For this task/step comment out the `lifecycle` hook in `backend-deployment.yaml` (or just skip this step and do the full implementation of `backend-deployment.yaml` at the next step).  
Then apply the manifest for the backend service:
```
kubectl apply -f backend-deployment.yaml
```
You should see something like this printed out to the terminal:
```
deployment.apps/flask-backend-deployment created
service/flask-backend-service configured
```
Verify using [this postman collection](./mlip-kubernetes.postman_collection.json) AND/OR the following `cURL` commands. For obtaining the correct port, see [Accessing the Backend Service](#accessing-the-backend-service). You should see the `host` parameter in the response body vary across requests: 
```
curl --location --request GET '127.0.0.1:<some-port-here>/model-info'
```

```
curl --location --request POST '127.0.0.1:<some-port-here>/predict' \
--header 'Content-Type: application/json' \
--data-raw '{
    "avg_session_duration": 30,
    "visits_per_week": 14,
    "response_rate": 4,
    "feature_usage_depth": 6,
    "user_id": 34
}'
```
4. Looking at the responses from either the GET or the POST requests, how can you verify that Kubernetes is load-balancing the requests across the replicas of the backend inference service (hint: the `host` field might be helpful here). Discuss with the TA how Kubernetes routes traffic to the replicas of a service. 

   Consider reading the following source to better understand how Kubernetes routes traffic in a service:
   - https://kubernetes.io/docs/concepts/services-networking/

## Task 3: Implement the lifecycle hook and re-deploy service in Kubernetes
1. Configure the lifecycle `preStop` hook in [backend-deployment.yaml](backend-deployment.yaml) to signal to the [backend.py](./backend.py) process that the 

2. Re-deploy the backend: 
```
kubectl apply -f backend-deployment.yaml
```

3. Now that this task is complete you should be able to demonstrate the behavior of te lifecycle hook:    

```
# for verifying shutdown hooks
kubectl rollout restart deployment/flask-backend-deployment
# then in a separate process
kubectl logs -l app=flask-backend -f
```
4. Based on the logs you observed during the rollout restart, when does the preStop container lifecycle hook run relative to Kubernetes sending SIGTERM to the container? Explain the graceful shutdown sequence to the TA and describe one practical use case for lifecycle hooks.

   Consider reading the following two sources to better understand how Kubernetes handles shutdowns:
   - https://kubernetes.io/docs/concepts/containers/container-lifecycle-hooks/
   - https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination

### 


---

## Build and Push the Docker Image:
Before you do the following steps, ensure you have logged into docker. You will need to do the following for EACH type of image (trainer and backend)
```
docker build -t <your-dockerhub-username>/<backend-image-name>:1.0.0 -f Dockerfile.backend .
docker push <your-dockerhub-username>/<backend-image-name>:1.0.0
```

## Accessing the Backend Service
Access the Backend Service via the NodePort

1. **Access via NodePort**:

- Get the MiniKube IP:
  ```
  minikube ip
  ```
- Access the backend service using `curl` (replace `<minikube-ip>` with the output from `minikube ip`):
  ```
  curl "http://<minikube-ip>:30080/?user_id=Alice"
  ```

2. **Use `minikube service` (If NodePort Does Not Work)**:

- Create a tunnel to the backend service:
  ```
  minikube service flask-backend-service
  ```
- This command will provide a URL, typically in the format `http://127.0.0.1:<some-port>`, which you can use to test the backend service.


## Troubleshooting
- **Launch MiniKube Dashboard**:
Open the MiniKube dashboard to monitor the status of Pods, deployments, and services:
  ```
  minikube dashboard
  ```
- **Minikube IP Issues**: Use `minikube ip` to verify the correct IP.
- **Service Not Accessible**: If NodePort does not work, use `minikube service` to create a tunnel.
- **Backend Logs**: Use `kubectl logs -l app=flask-backend -f` to monitor requests going to the backend.
- **Image Pull Issues**: Ensure your Docker images are pushed to Docker Hub with the correct tags. [More Details](https://docs.docker.com/get-started/introduction/build-and-push-first-image/)
