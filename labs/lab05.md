# Lab 5: Containerizing ML Models with Docker

## Overview
In this lab, you will containerize a machine learning training pipeline and inference server using Docker. You will train a Wine classifier, serve it via Flask, and orchestrate both containers with Docker Compose. A key focus of this lab is **Docker volume management** — you will use both named volumes and bind mounts to share data between containers and persist artifacts on the host.

Clone the code from [this](https://github.com/BhuvanashreeM/mlip-docker-lab-s26) repository and follow the instructions in the README.

### Deliverables

 - [ ] **Deliverable 1**: The training script has been run in a container and the resulting model is saved to a shared volume. Able to explain why Docker is useful for reproducibility and portability in ML training scenarios.

 - [ ] **Deliverable 2**: Containerize the inference service to serve predictions on a specific port and show the `./logs/predictions.log` file on your host to the TA.  Explain what the Dockerfile is and how it helps containerize the inference service.

 - [ ] **Deliverable 3**: Call the inference service health endpoint before and after destroying the named volume to demonstrate how model availability changes. Explain the difference between named volumes and bind mounts in Docker.


## Step 0: Setup Docker

Install Docker on your system and verify your installation:

```bash
docker run hello-world
```

Follow the instructions for your operating system: https://docs.docker.com/get-docker/

## Additional Resources

1. [Docker For Beginners](https://docker-curriculum.com/)
2. [Docker Volumes Documentation](https://docs.docker.com/storage/volumes/)
3. [Docker Bind Mounts Documentation](https://docs.docker.com/storage/bind-mounts/)

## Troubleshooting
If you encounter issues:
- Check Docker daemon status
- Verify port availability (is port 8081 already in use?)
- Review service logs with `docker compose logs`
- Ensure the training service completes before the inference service starts
- Use `docker compose exec` to inspect container file systems
- If the model file is missing, check that your named volume is correctly mounted with `docker volume ls`
- If logs are not appearing on the host, verify your bind mount path