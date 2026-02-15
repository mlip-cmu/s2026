# Group Project: Movie Recommendations

(17-445/17-645/17-745 Machine Learning in Production; 11-695 AI Engineering)

## Overview

In this project, you will implement, evaluate, operate, monitor, and evolve a recommendation service for a movie streaming service. You work with a streaming service with about 1 million customers and 20,000 movies (for comparison, Netflix has about 180 million subscribers and over 300 million estimated users worldwide and about 13,000 titles worldwide). Imagine you are in the early days of video streaming and are building a Netflix-like streaming business with a massive catalog of not very recent movies that you mostly could license cheaply.

The focus of this assignment is to *operate* a recommendation service *in production*, which entails many concerns, including deployment, scaling, reliability, drift and feedback loops.

The assignment has multiple milestones and a final project presentation. It has a total of 415 points.

## Overall mechanics and infrastructure

**Teamwork:** You will work on this project in your assigned teams. As a team, you will use a shared GitHub repository and a virtual machine to coordinate your work. Please establish a way of communication and collaboration that works for your team -- for example, a Slack channel and a Trello board. Please agree on how you take clear notes at meetings that include agreed tasks and responsibilities. We expect that team members will have different backgrounds and different amounts of experience with machine learning and software engineering -- this is intentional. Use the first milestone to identify strengths and weaknesses, fill missing gaps in background knowledge, and teach each other about tools and practices that are effective for this task. We will provide bonus points when team members go outside their comfort zone and explore new/challenging concepts. We do not expect that all team members contribute equally to each part of the project, but we expect that all team members make every effort to be a good team citizen (attend meetings, prepared and cooperative, respect for other team members, work on assigned and agreed tasks by agreed deadlines, reaching out to team members when delays are expected, etc). We will regularly check in about teamwork with a mandatory survey and perform *peer grading* to assess team citizenship of individual students after every milestone (see this [paper](http://www.rochester.edu/provost/assets/PDFs/futurefaculty/Turning%20Student%20Groups%20into%20Effective%20Teams.pdf) page 28-31 for procedure details and this [site](https://mlip-cmu.github.io/s2025/assignments/peergrading.html) to preview impact on grades). We will debrief with each team after every milestone and discuss teamwork issues raised.

**Project mentor:** Each team is assigned to a TA who acts as mentor for the project. Each mentor has completed the project themselves in the past. Mentors will discuss and help with teamwork issues. While the mentor will not pre-grade milestones, they can help with clarifying grading expectations and may be able to provide feedback on technical decisions. Each team conducts a debriefing with their mentor after every milestone.

**Milestones:** For each milestone and the final presentation, there are separate deliverables, described below. The milestones are checkpoints to ensure that certain functionality has been delivered. Milestones are graded on a pass/fail scheme for the criteria listed with each milestone. Teams may submit work for milestones late or redo milestones with their team tokens as described in the [syllabus](https://mlip-cmu.github.io/s2025/).

Milestones build on each other. We recommend to look at *all* milestones before starting the project, as this might help you to make more future-proof design decisions that avoid extensive rework later.

**Infrastructure:** We provide a virtual machine for each team and will send recommendation requests to your virtual machines. You receive data about movies and users through an API and can access log files from past movie watching behavior through a Kafka stream (see the assignment text for M1 on Canvas for server addresses and credentials). We provide separate streams for each team (`movielog<TEAM-NR>`). You will provide a prediction service API from your virtual machine. You can but do not need to perform all executions on that machine -- for example, you may build a distributed system with multiple cloud instances, where you use the provided virtual machine only as API broker or load balancer. You may request more computing resources from the course staff if the virtual machine’s resources are insufficient -- we may or may not be able to accommodate such requests, it may take a few days, and will usually require a system reboot.

**Provided data:** We provide an event stream (Apache Kafka) of a streaming service site that records server logs, which include information about which user watched which video and ratings about those movies. The log has entries in the following format:

* `<time>,<userid>,recommendation request <server>, status <200 for success>, result: <received recommendations>, <responsetime>` – the user considers watching a movie and a list of recommendations is requested; the recommendations provided by your service are included (or an error message if your service did not provide a valid response)
* `<time>,<userid>,GET /data/m/<movieid>/<minute>.mpg` – the user watches a movie; the movie is split into 1-minute mpg files that are requested by the user as long as they are watching the movie
* `<time>,<userid>,GET /rate/<movieid>=<rating>` – the user rates a movie with 1 to 10 stars
* `<time>,<userid>,GET /create_account` – a new user has just created an account

In addition, we provide read-only access to an API to query information about users and movies at `http://<ip>:8080/user/<id>` and `http://<ip>:8080/movie/<id>`. They accept up to 200 comma-separated ids for bulk requests. Both APIs provide information in JSON format, which should be mostly self-explanatory.  The user data often includes answers to two prompts "What movies do you like" and "What movies do you not like" that users could fill out when they signed up. The movie data comes mostly from [TMDB](https://www.themoviedb.org/) and may be incomplete. Each movie has a license cost, which is what the company pays to rights holders per play. You may collect data from external data sources not provided by the course staff; ids for [IMDB](https://www.imdb.com/) and [TMDB](https://www.themoviedb.org/) are provided for each movie and can be matched against the [public IMDB datasets](https://developer.imdb.com/non-commercial-datasets/) or [various](https://www.kaggle.com/datasets/asaniczka/tmdb-movies-dataset-2023-930k-movies) [Kaggle](https://www.kaggle.com/datasets/alanvourch/tmdb-movies-daily-updates) [datasets](https://www.kaggle.com/datasets/barryhaworth/imdb-parental-guide) or the [TMDB API](https://developer.themoviedb.org/docs/getting-started).

You do not need to use all provided data from the stream or APIs. Identify what data is relevant. Plan for the fact that data gathering and cleaning data may take some time; the provided raw data is fairly large and you may need some time to download and process it. The APIs are rate-limited to avoid abuse. If Internet bandwidth is a problem, consider performing some preprocessing on machines within the CMU network.

The addresses and credentials for the provided event stream and the APIs can be found on Canvas in the text of assignment M1.

**Languages, tools, and frameworks:** Your team is free to choose any technology stack for any part of this project. You have root access to your virtual machine and are free to install any software you deem suitable; but be responsible and careful as you also have the power to misconfigure the machine to make it insecure or inaccessible. You also may use external data and services (e.g. cloud services) as long as you can make them also accessible to the course staff. For example, you can use the free cloud credits that companies like Microsoft, Google, and AWS provide to students for this project (see Canvas for links and codes). Whenever you set up tools or services, pay some attention to configuring them with reasonable security measures. 

*Each semester, several teams lose access to their VMs at some point during the semester due to security issues, misconfigurations, or running out of disk or memory.* This includes having their machines taken over by attackers and losing all data or being taken off the network by campus IT over open vulnerabilities.

## Milestone 1: Recommendation Model and First Deployment

**Learning goals:**

* Collect data from multiple sources and engineer features for learning
* Apply state of the art machine learning tools
* Deploy a model inference service 
* Measure and compare multiple quality attributes of your model
* Practice teamwork and reflect on the process

**Tasks:**

*Get started as a team:* Get familiar working as a team. Discuss how you plan to collaborate, assign a project manager, and write down a team contract. Take notes at team meetings about how you divide the work (minimum: who is going to do what and by when).

*Train a model and address cold start:* Train a model that can recommend movies for a specific user. There are many different approaches to learn models for recommendations; some consider past ratings, some use similarity between users or between movies, others may use subtle clues about user behavior as signs of what they like. Think about how you could solve the cold start problem and try to make use of the user's self-described likes and dislikes they may have provided when they signed up.

*Compare models:* You will likely explore different kinds of models developed with different modeling techniques. Compare those models in terms of (1) some notion of prediction accuracy, (2) training cost, (3) inference cost (or throughput in production), and (4) disk or memory size of the model. For each of these qualities define a measure (using the three steps metric, data, and operationalization; described clearly enough that it could be independently reimplemented) and report results from at least two models. For example, you could compare collaborative filtering with an LLM-based solution.

*Serve your model:* Build a model inference service that provides movie recommendations on request given your learned model (e.g. using [flask](https://flask.palletsprojects.com/en/1.1.x/)). Specifically, we will start to send http calls to `http://<address-of-your-virtual-machine>:8082/recommend/<userid>` to which your service should respond with an ordered comma separated list of *up to 20 movie IDs* in a single line (not json, not anything else), from highest to lowest recommendation. We will wait for answers to our requests for *at most 600ms*. You can recognize whether your answer has been correctly received and parsed by a corresponding log entry in the Kafka stream (expect to see an entry `<time>,<userid>,recommendation request <server>, status <200 for success>, result: <parsed recommendations>, <responsetime>` with status code 200).

Note that users of the streaming service will immediately see recommendations you make and your recommendations may influence their behavior.

For this milestone, we do not care about specifics of how you learn or deploy your model, how accurate your predictions are, or how stable your service is.

**Deliverables:** Push your code to GitHub and include a `m1_report.pdf` or `m1_report.md` file in the root of the repository. Submit the URL of your latest commit to Canvas and schedule a debriefing meeting with your team's mentor.

The report should have the following sections:

* *Learning* (1 page max): Briefly describe what data and what kind of machine learning technique(s) you use and why. Describe how you tried to solve the cold-start problem. Provide a pointer to your implementation where you train at least two different models (e.g. to GitHub or other services). 
* *Model comparison* (1 page of text max, the table does not count toward the page limit): Define a suitable measure for all four qualities above using the *three-step format* (1) metric, (2) data gathered, (3) operationalization. The description should be accurate enough that one could independently reimplement and repeat the measurement without having access to your code. Provide a link to any code you wrote to conduct the measurements. Provide a table that lists the four measurement results for the two models from the previous step and argue which of these models you will use in production. For example, this table could have rows for the four measures and columns for the two models and the cells would report the measurement results.
* *Prediction service* (1 page max): Briefly describe how you implemented the recommendation service and how you derive a ranking from your model. Provide pointers to the relevant parts of your implementation for model training and serving recommendations (e.g. to GitHub or other services).
* *Team contract and meeting notes* (1 page of text max, figures do not count toward the page limit): Briefly describe your agreement on how your team organizes itself. This should include: 
  1. What expectations do you set for communication, such as what channels to use and how fast to expect a response? 
  2. How will you handle project and team management tasks, such as scheduling meetings, taking notes, and sending reminders? (name the team members responsible)
  3. What process do you use for dividing work and assigning responsibilities? 
  4. What should happen if a team member is not responsive, faces problems, or delays occur? 
  5. What other agreements did you make to avoid future teamwork problems, if any?
  6. Include a screenshot of (or link to) notes taken at team meetings that describe how work was divided for this milestone: *who* was responsible for *what*, by *when*.

In this and all future milestones, answers may exceed the page limit a bit if there is a good reason. However, if you are using LLMs to generate answers, try to stay within the page limit. We prefer precise and concise answers over long and rambling ones and may reject excessively long answers.

**Grading:** The grading specifications below focus on completing the work and each part is graded pass/fail. We will not attempt to evaluate the quality of the prediction service. We will not try to distinguish between better and worse solutions, but will give full credit if the specification is met and none otherwise for each specification. For example, if the teamwork notes do not include a due date for each task then all 10 points for that part are deducted, even if the description is otherwise well done. The specifications should be clear enough that you can confidently judge yourself whether you have achieved the goal; if in doubt contact the course staff. Note that you can regain lost points by resubmitting the solution as described in the syllabus.

This milestone is worth 106 points:

* [ ] 10pt: The report contains a description of the data used and the learning technique selected. The text explains why this approach was chosen. The described chosen approach matches the problem.
* [ ] 10pt: A link to the implementation of the learning step is provided. The implementation matches the description and addresses the learning problem. 
* [ ] 10pt: The report explains how the cold-start problem is addressed. The approach considers the users' self-descriptions.  The implementation matches the description.
* [ ] 5pt each (up to 20pt): The report describes metrics of the four qualities explicitly in the three steps: metric, data, and operationalization. The correct information is described for each step and the description is clear and sufficient to independently measure the quality. A pointer to implementation of each measurement is provided. The results of the measure are reported and match to the metric description and the models. 
* [ ] 10pt: The report contains a description of the prediction service and explains how a ranking is computed. A link to the implementation of the prediction service is provided. The implementation matches the description.  
* [ ] 10pt: The report includes a team contract (or a link to a team contract) describing how the team plans to work together and handle problems. The team contract covers at least the five questions listed above. The report includes a screenshot of teamwork notes (or a link to the notes) and those notes describe how the work was divided, answering *who* was supposed to do *what* by *when*.
* [ ] 10pt: The prediction services successfully answers at least 2000 recommendation requests in the 24 hours before or after submission. To be successful, the answer must be well-formed and arrive within the time limit. (We use the status message in the movielog for grading, considering status 200 as "successfully answered").
* [ ] 10pt: The prediction service answers at least 10% of all recommendation requests in the 24 hours before or after submission with *personalized* recommendations (i.e., `200` status, not the same recommendation for every user).
* [ ] 10pt (individually): The team schedules a debriefing meeting within one week after submission of the milestone with their team mentor. The team members can convince the mentor that they understand their solution and that they have thought about alternatives (e.g., different models, different solutions to the cold start problem). The team members talk about their teamwork experience and any problems they may have faced.
* [ ] 3pt (individually): The teammaker survey (on Catme) is filled out.
* [ ] 3pt (individually): The teamwork survey for this milestone is filled out.
* [ ] 3pt: Bonus points for social activity (see very end of this document)
* [ ] 3pt: Bonus points for going beyond the comfort zone (see very end of this document)



## Milestone 2: Model and Infrastructure Quality

**Learning goals:**

* Test all components of the learning infrastructure
* Build an infrastructure to assess model and data quality
* Build an infrastructure to evaluate a model in production
* Use continuous integration to test infrastructure and models

**Tasks:**

*Pipeline implementation, testing, and data quality:* First, if you have not done so already, migrate your learning infrastructure to a format that is easy to maintain and test. That will likely involve moving out of a notebook and splitting code for different steps in the pipeline into separate modules that can be called independently. Test all steps of your pipeline so that you have reasonable confidence in the correctness, robustness, and possibly other qualities of your learning solution (including your solution to the cold start problem). Also test the correctness of your prediction service. Design, implement, and test a strategy to deal with data quality problems, especially schema enforcement and detecting substantial drift.

*Continuous integration:* Second, automate all your infrastructure tests in a continuous integration platform. The platform should automatically build and test your pipeline and prediction service implementation and create reports for test results and coverage. You can but are not required to trigger the actual model training and evaluation pipeline every time a new commit is made.

*Model evaluation:* Third, evaluate the *accuracy* of your recommendation model both offline and online. For the offline evaluation, consider an appropriate strategy (e.g., suitable accuracy measure, training-validation split, important subpopulations, considering data dependence). Avoid common pitfalls in model evaluation, such as label leakage, data dependencies, overfitting on test data, and other common issues discussed in class. For the online evaluation, design and implement a strategy to evaluate a notion of model accuracy in production (e.g., choose and justify metric, collect telemetry).

*Cost evaluation:* Finally, in addition to online evaluation of accuracy, measure the *runtime cost* of your system in terms of movie licensing fees (see `cost` field in the movie metadata, which is the cost in USD paid to the license holder for each view) and token consumption for any LLM use.

*Good commits and code review:* At this point, we do require that you work with Git for all your code and changes. Make reasonably cohesive commits with appropriate commit messages. We recommend adopting a process with your team in which you use [pull requests to review and integrate changes](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests).

**Technical details:** For *model accuracy*, we accept a wide range of possible metrics, including proxies that provide only partial insights about accuracy. Make a judgement about what metric is appropriate for the problem and feasible to implement. For *online evaluation* of model accuracy and cost, you should use production data to test your model. You can evaluate the model with a fixed snapshot of production data in this milestone -- you should focus on establishing measures, but you do not need to continuously monitor the system until Milestone 3.

The *pipeline* refers to all parts of the learning process. For example, it should have functionality to gather training/evaluation data from the Kafka stream and the provided APIs (and possibly other data sources), to clean data, and extract features, train models, evaluate predictions, serialize models, serve models, and collect telemetry. All those steps should be reasonably robust and repeatable. You may store intermediate results in files or databases on your virtual machine or in the cloud if you like. Overall, the implementation should make it easy to run the pipeline for experimentation (e.g., after changing hyperparameters) or on more recent data.

Evaluate *infrastructure code quality* by testing all steps in your model learning and evaluation pipeline, especially all data transformation code. You do not need to test whether the machine-learning algorithm itself is correctly implemented. Note that running tests with small amounts of sample data rather than full datasets from production is usually sufficient and appropriate. You likely also want to test your inference service that uses the model. Use automated unit tests and report code coverage. For unit testing consider Python's builtin `unittest` or the external `nose2` or `pytest`; `coverage.py` or `Pytest-cov` can be used to measure coverage. Testing is often much easier when code is written to be testable: You may want to refactor your code, e.g., extract the code that parses a line from Kafka or the API as a separate function. You may consider the use of mocks or stubs for testing, especially for parts that otherwise rely on network connections or files from the production system. Make your own decisions about how much testing is appropriate to gain confidence in the correctness and robustness of your solution. It can be helpful to anticipate scenarios that may break your function and include defensive code to handle them. 

Set up a *continuous integration* service. We recommend using a local runner with GitHub actions or installing Jenkins on your virtual machine, but you can explore other options (note, cloud services often provide limited credits that may be shared by the entire class). This service should run the unit tests for the infrastructure every time code changes are pushed to GitHub. We do not expect that you automate model training and evaluation pipelines with CI; focus on infrastructure quality tests.

For *data quality*, focus on data schema issues and identifying strong drift in all data sources. During and after this assignment, we may inject data quality issues in the Kafka stream or provided API or we may make invalid requests to your API. Try to make your service robust, such that it continues to work despite such problems or that you notice problems quickly.

You do not need to create a visual frontend for this milestone.

**Deliverables:** Push your code to GitHub and include a `m2_report.pdf` or `m2_report.md` file in the root of the repository. Submit the URL of your latest commit to Canvas and schedule a debriefing meeting with your team's mentor.

The report should include the following sections:

* *Offline evaluation* (1 page of text max, not counting figures): Briefly explain how you conduct your offline evaluation. This should include a description of the validation/test data and how it was derived and a brief description and justification of the used accuracy metric (in the usual 3-step description). Include a brief discussion of how you avoided the common pitfalls in offline evaluations discussed in class. Include or link to evaluation results in your report. Provide a pointer to the corresponding implementation in your code.
* *Online evaluation* (1 page of text max, not counting figures): Briefly describe the accuracy and cost metrics used for evaluating model quality and system quality in production, the telemetry data collected, and the operationalization of the metric. Include or link to evaluation results in your report. Provide a pointer to the corresponding implementation in your code.
* *Data quality* (0.5 pages max): Briefly describe the steps you have taken with regard to data quality and provide a pointer to the corresponding implementation in your code. The checks cover at least some schema issues and some possible drift.
* *Pipeline implementation and testing* (1 page of text max, not counting figures): Briefly describe how you structured the implementation of your pipeline and how you conducted testing. Include or link to a coverage report. Briefly argue why you think the testing is adequate. Provide a pointer to the corresponding implementation and test suite in your code (preferably a direct GitHub link).
* *Continuous integration* (0.5 pages max): Describe your continuous integration setup for infrastructure testing. Provide a pointer to the service (and create accounts for your team mentor or privately share credentials if needed to access the platform).
* *Pull requests* (optional): If you use code reviews and pull requests within your team, provide a very short description of your process and link to 3 examples of your own pull requests.
* *Team contract update:* If your team decided, after the last debriefing or based on experiences during this milestone, to revise the team contract from Milestone 1 or to change project management responsibilities, include the updated contract and describe the reason for the change, otherwise just state "no update to team contract".

**Grading:** This milestone is worth 103 points: 

* [ ] 10pt: Most commits (>80%) are reasonably cohesive and contain reasonable commit messages. The code is generally reasonably well structured and understandable.
* [ ] 10pt: The report describes how the pipeline is implemented and structured and contains a pointer to the pipeline implementation. The implementation matches the description.
* [ ] 10pt: Data quality checks are described in the report and implemented (with a link to the implementation provided). The checks cover all interfaces to external data, including the Kafka stream, the user and movie APIs, and your recommendation API.  The description matches the implementation. At a minimum, schema violations in inputs are detected and handled and strong data drift is detected.
* [ ] 10pt: A suitable strategy for *offline* model evaluation is described in the report that covers (1) validation/test split, (2) a clear 3-step description of the used metric, and (3) a plausible justification of why the metric is suitable for the problem and avoids common pitfalls. A link to a corresponding implementation that matches the description is provided. Offline evaluation results are included or linked for the used model that were computed with the described process and metric.
* [ ] 10pt: A suitable strategy for online model evaluation is described in the usual three step format: (1) the model accuracy metric used, (2) the telemetry data collected, and (3) how the metric is computed from the data. A link to a corresponding implementation that matches the description is provided. Online evaluation results that were computed with the described process and metric are included or linked.
* [ ] 10pt: A suitable strategy for online cost evaluation is described in the usual three step format: (1) the cost metric used, (2) the telemetry data collected, and (3) how the metric is computed from the data. The costs need to include the license cost of the movie provided in the movie metadata and the cost of any external LLM usage. A link to a corresponding implementation that matches the description is provided. Online evaluation results that were computed with the described process and metric are included or linked.
* [ ] 10pt: A description of how the pipeline was tested is included in the report and a link to the corresponding tests is included. The report argues why the performed testing was adequate. A coverage report is included or linked.
* [ ] 10pt: The infrastructure tests are all automated with a continuous integration service and triggered automatically when code is changed on GitHub. A pointer to the service is provided.
* [ ] 10pt: An updated team contract is provided with a reason for the change, or a statement that the team contract remains unchanged is included.
* [ ] 10pt (individually): The team schedules a debriefing meeting within one week after submission of the milestone with their team mentor. The team members can convince the mentor that they understand their solution and that they have thought about alternatives (e.g., different online metrics, different data quality checks). The team members talk about their teamwork experience and any problems they may have faced.
* [ ] 3pt (individually): The teamwork survey for this milestone is filled out.
* [ ] 5pt: Bonus points for using pull requests and conducting code review within those pull requests for the majority of changes. A brief description of the process is included in the report.
* [ ] 3pt: Bonus points for social activity (see very end of this document)
* [ ] 3pt: Bonus points for going beyond the comfort zone (see very end of this document)



## Milestone 3: Monitoring and Continuous Experimentation

**Learning goals:**

* Deploy a model prediction service with containers and support model updates without downtime
* Build and operate a monitoring infrastructure for system health and model quality
* Build an infrastructure for experimenting in production 
* Infrastructure for automatic periodic retraining of models
* Version and track provenance of training data and models

**Tasks:** *Important: Read availability requirements. The service should be available during the 72 hours before the milestone submission.*

After gaining confidence in your infrastructure quality and automating essential tasks, we will now focus on deployment, versioning, experimentation, and monitoring.

*Containerization:* First, containerize your model inference service (and possibly other parts of your infrastructure). Add support for switching between different versions without downtime (e.g., adding a load balancer).

*Automated model updates:* Second, set up an automated process to periodically train a new version of your model on more recent data and push those models into production (e.g. every 3 days). Also fully automate all attempts at solving the cold-start problem using the users' self descriptions as new users sign up.

*Monitoring:* Third, set up a monitoring infrastructure that monitors (a) the health of your recommendation service (including availability), (b) the quality of its predictions, (c) the operating costs, and (d) data drift. You might want to set up automated alerts if problems are detected.

*Experimentation:* Fourth, build or set up an experimentation environment, in which you can compare two models in production (e.g., for an A/B test or a canary release). Report confidence in differences between models using appropriate statistical tests. Run and report results of at least two experiments:

* What's the impact of your approach using the users' self descriptions for overcoming the cold-start problem on prediction quality?
* Can you effectively reduce operating cost by getting users to watch movies with cheaper licensing costs, and how much would this reduce the user satisfaction (i.e., movie ratings)?

*Versioning and provenance:* Finally, track provenance of your predictions and models such that for every prediction your recommendation service makes you can answer: (1) which version of the model has made the prediction, (2) which version of the pipeline code and ML algorithms has been used to train that model, and (3) what data has been used for training that model.

*Availability:* Keep your recommendation service running as much as possible for the remainder of the project. We will evaluate the availability in the *72 hours before your submission and the 96 hours after your submission*. Prefer low-quality recommendations over missing or very slow answers from your service. We will look at the public logs in the Kafka stream to assess downtime. 

**Technical details:** We recommend Docker to containerize your model serving infrastructure. You can package the model inside the container or have the container load the model from an external resource (e.g., mounted file system or web server). You can write your own simple load balancer in 10 lines of Python or Node.js code if needed, so you can switch between multiple models without downtime. Alternatively, some teams have used orchestration software like Kubernetes to manage containers, but the learning curve can be steep.  

For automatic model updates, we recommend that you fully automate the process and trigger it with a cronjob, but we also accept if humans manually have to trigger a task or approve the deployment as long as it is as simple as running a single shell script.

We recommend to mostly use existing tooling for monitoring, such as Prometheus and Grafana. You may use external cloud services if you prefer. Monitor at least availability of your service (e.g., preferably analyzing the Kafka logs not just your own server's telemetry) and the online model accuracy and cost measures. You can reuse the measures from milestone 2 but should now monitor them continuously.

For experimenting in production, you can write your own infrastructure or use an external library or service (e.g., [LaunchDarkly](https://launchdarkly.com/) or [split](https://www.split.io/)). You will probably write your own simple load balancer to route traffic to different model servers. You can use your existing telemetry infrastructure to identify model accuracy in production for each model. It is nice, but not essential, to have a visual frontend to adjust how users are divided between different models and to show differences in measured outcomes. If no such visual frontend is created, you might want to create a notebook or command-line tool to compute and print the results of the experiment.

Regarding provenance, you have again full flexibility. You may use a tool like [dvc](https://dvc.org/) or [TReq](https://treqs.ai), track metadata with a tool like [MLflow](https://mlflow.org/), or write your own mechanisms. The key point is being able to track all inputs used for a prediction when needed, e.g., for debugging. Consider tradeoffs among different qualities, such as the amount of data stored and the effort in retrieving it.

Although we do not set explicit requirements for quality assurance, we suggest that you continue to write test cases for your infrastructure code and conduct code reviews within your team.

**Deliverables:** Push your code to GitHub and include a `m3_report.pdf` or `m3_report.md` file in the root of the repository. Submit the URL of your latest commit to Canvas and schedule a debriefing meeting with your team's mentor.

The report should include the following sections:

* *Containerization* (0.5 pages max): Briefly describe how you containerized and deployed your inference service. A diagram may be helpful. Provide a pointer to the Dockerfile(s) and other relevant implementations (preferably a direct GitHub link).
* *Automated model updates* (0.5 pages max): Briefly describe how you automatically retrain and deploy updated models. Describe how you continuously analyze user self descriptions as new users sign up. Provide a pointer to the relevant implementation (preferably a direct GitHub link).
* *Monitoring* (0.5 pages text max, excluding figures): Briefly describe how you set up your monitoring infrastructure and what you monitor and whether and why you set alerts. Include a screenshot of your dashboard showing at least availability, model accuracy, cost, and data drift measures. Provide pointers to the corresponding code/infrastructure (preferably a direct GitHub link).
* *Experimentation infrastructure* (1 page max, excluding figures): Briefly describe the design of your experimentation infrastructure. Describe how you split users between models, how you track the quality of each model, and how you report differences among models. Explain the statistical tests you use and justify why they are appropriate for this task. Provide pointers to your implementation/infrastructure.
* *Experiment results* (1 page max): Describe how you answer the two questions above with experiments. Include results for both experiments (screenshot or link). 
* *Provenance* (2 pages max): Describe how you version and track provenance of predictions and models. Explain how you can, for any past recommendation, identify the model version, the used pipeline version, and the used training data. Illustrate this with a concrete example of one past recommendation. Provide sufficient pointers such that the course staff could also identify the corresponding information for a given recommendation and find the corresponding data and implementation.
* *Team contract update:* If your team decided, after the last debriefing or based on experiences during this milestone, to revise the team contract from Milestone 2 or to change project management responsibilities, include the updated contract and describe the reason for the change, otherwise just state "no update to team contract".

**Grading:** This milestone is worth 103 points: 

- [ ] 10pt: Infrastructure setup with containers is described in the report; links to relevant implementations are provided; containers are running in production.
- [ ] 10pt: Models are automatically updated with more recent data. The report describes the process for retraining and deployment and provides pointers to the corresponding implementation. The users' self-descriptions are automatically analyzed as new users sign up. The description matches the implementation.
- [ ] 15pt: A monitoring infrastructure observes (a) service availability, (b) model accuracy, (c) cost of movie licenses and LLM APIs, and (d) data drift. The report describes the infrastructure. The report describes and justifies what alerts were set up or why no alerts were used. A screenshot of the service is included and pointers to implementation and running dashboard are provided (create an account for the team mentor or share credentials privately). The description matches the implementation.
- [ ] 10pt: An infrastructure for online experimentation is implemented. Appropriate statistical tests are used to report confidence in the experiments’ results. The report describes how users are split, how quality is tracked, and how results are reported. 
- [ ] 10pt: An experiment on the impact of using the users' self description for helping with the cold-start problem is described. It is clear what exact change was tested. A screenshot of an experiment’s outcome is included. Links to the corresponding implementation are provided. The description matches the implementation.
- [ ] 10pt: An experiment on how different models can reduce licensing costs is described. It is clear what alternative model was tested. A screenshot of an experiment’s outcome on both cost and prediction quality (ratings) is included. Links to the corresponding implementation are provided. The description matches the implementation.
- [ ] 10pt: The report describes how provenance is tracked. It explains how for a given prediction the responsible model can be identified and how for that model the corresponding pipeline version and training data can be identified. It illustrates that process with one concrete example. Links to the corresponding implementation are provided. The description matches the implementation.
- [ ] 10pt: The recommendation service is at least 70% available in the 72 hours before the submission and the 96 hours after (i.e., max downtime of 50h), while at least two updates are performed in that time period.
- [ ] 5pt: An updated team contract is provided with a reason for the change, or a statement that the team contract remains unchanged is included.
- [ ] 10pt (individually): The team schedules a debriefing meeting within one week after submission of the milestone with their team mentor. The team members can convince the mentor that they understand their solution and that they have thought about alternatives (e.g., different ways to run experiments, different provenance tracking). The team members talk about their teamwork experience and any problems they may have faced.
- [ ] 3pt (individually): The teamwork survey for this milestone is filled out.
- [ ] 5pt: Bonus points if the recommendation service is at least 99% available in the same 7-day window (max 100min downtime), while at least two updates are performed in that time period.
- [ ] 3pt: Bonus points for social activity (see very end of this document)
- [ ] 3pt: Bonus points for going beyond the comfort zone (see very end of this document)



## Milestone 4: Fairness, Security, and Feedback Loops

**Learning goals:**

* Reason about fairness requirements and their tradeoffs
* Analyze the fairness of a system with concrete data 
* Identify feedback loops
* Anticipate adversarial attacks and other security issues in machine-learning systems
* Design and implement a monitoring strategy to detect feedback loops and attacks

**Tasks:** 

*Anticipating risks:* Analyze your recommendation service and the system into which it is embedded with regard to fairness, security, safety, and feedback loops. Select and follow a process for this analysis, such as hazard analysis for safety and threat modeling for security. For each, anticipate two possible issues, one at the component and one at the system level, and discuss how you would mitigate those issues. You are not required to make any changes to the system to implement the mitigations (now or later).

*Audit:* Select one fairness issue, one security issue, one safety issue, and one possible feedback loop and perform a concrete analysis of the system using telemetry data to analyze whether the fairness requirement is met, whether there is a sign of a security attack, whether safety harms occur, and whether there is evidence of the feedback loop.

**Technical details:** For anticipating risks, we expect a somewhat systematic process beyond just brainstorming (see minimum requirements below). Include some evidence that you actually followed the process, which might be any artifacts developed in the analysis process (e.g., biases considered, threat models). Anticipate risks both for the recommendation service and for the system into which it is embedded.

For analyzing issues with actual data, you will analyze past recommendations and user behavior, for example, changes in user behavior over time, recommendation quality differences for different populations, drift in recommendation requests or user behavior. We have no requirements for how to conduct this analysis but recommend to explore the data and share the results with a notebook.

We may have introduced some bias in the data, introduced mechanisms for specific feedback loops in our infrastructure, and are injecting attacks on your service. For example, you likely have recommended R rated movies to minors. You do not need to detect the issues we introduced. It is okay if you identify that the issue you analyze is not occurring or detect issues that we did not plan for. You can receive full credit with a rigorous analysis, independent of whether you find any actual issues and independent of whether you detect the issues that we artificially introduced. 

**Deliverables:** Push your code to GitHub and include a `m4_report.pdf` or `m4_report.md` file in the root of the repository. Submit the URL of your latest commit to Canvas and schedule a final debriefing meeting with your team's mentor.

The report should include the following sections:

* *Fairness risks* (2 page max): Describe the process you use for identifying fairness requirements and provide evidence that you followed this process.  The process should include (a) understanding potential fairness harms, (b) exploring bias in data and the sources of such bias, (c) identifying protected attributes, (d) negotiating conflicting fairness goals, and (e) considering how fairness interacts with other system goals (e.g. profits). As a result from this analysis state two plausible fairness requirements. Include a brief justification for each requirement and a measure each for assessing whether the requirement is met. 
* *Fairness improvement suggestions* (0.5 pages max): Briefly describe how you could improve fairness in the system, focused on the two fairness requirements you identified. At least one of the mitigations should relate to changes beyond the model (e.g., data collection, system design, process integration, monitoring and operation).
* *Fairness analysis* (1 page max): Briefly describe how you analyzed one of the two fairness requirements using telemetry data of your system. Summarize your key findings, including negative results. Provide pointers to the artifacts behind your analysis for details (ideally links to code or notebook files on GitHub).

* *Anticipating feedback loops* (2 page max):  A description of the *process* you used to anticipate possible feedback loops and include some evidence that you followed this process. We recommend to use the world-vs-machine framework to explicitly consider assumptions you make about the environment and how outputs of the system (recommendations) may influence inputs (telemetry, ratings). Consider whether these assumptions are equally true under all conditions or for all populations. Briefly discuss two possible feedback loops with negative consequences that you can anticipate.
* *Mitigating a negative feedback loop* (0.5 pages max): For both anticipated feedback loops, briefly discuss how you could change the system to mitigate potential negative effects of a feedback loop. If you recommend to not take any action, justify this decision too.
* *Analysis of a feedback loop* (1 page max): Briefly describe how you analyzed whether one of the two anticipated feedback loops is observable in your system using telemetry data of your system. Summarize your key findings, including negative results. Provide pointers to the artifacts behind your analysis for details (ideally links to code or notebook files on GitHub).

* *Security risks* (2 page max):  A description of the *process* you used to analyze possible security problems. Include some evidence that you followed this process in your analysis (copies or pointers). Consider the use of threat modeling to track data flows in your part of the system and consider possible attacks against each part. Briefly describe two possible and plausible security issues you identify, of which at least one should relate to attacks on the recommendation model.
* *Mitigating security issues* (0.5 pages max): For both possible security issues, briefly describe how you could change the system design to mitigate the problem.
* *Analysis of a security issue* (1 page max): Briefly describe how you analyzed, using telemetry data of your system, whether there are any attacks against your system with regard to one of the previously discussed security issues. Summarize your key findings, including negative results. Provide pointers to the artifacts behind your analysis for details (ideally links to code or notebook files on GitHub).
* *Safety risks* (2 page max):  A description of the *process* you used to analyze possible safety problems beyond the fairness, feedback loop, and security problems previously discussed. Include some evidence that you followed this process in your analysis (copies or pointers). Consider the use of hazard analysis. Briefly describe two possible and plausible safety issues you identify, both of which should pose potential real-world harms.
* *Mitigating safety issues* (0.5 pages max): For both possible safety issues, briefly describe how you could change the system design to mitigate the problem.
* *Analysis of a safety issue* (1 page max): Briefly describe how you analyzed, using telemetry data of your system, whether your system causes harms for one of the previously discussed safety risks. Summarize your key findings, including negative results. Provide pointers to the artifacts behind your analysis for details (ideally links to code or notebook files on GitHub).

The final debriefing with the team mentor should cover the following reflection questions:

* *Reflection on the recommendation service:* Reflect on the recommendation service you built, for example: What parts were the most challenging? Which aspects are still unstable and would require additional investment if you had to deploy the recommendation service at scale in production? How would you address these issues if you had more time and more resources? If you had to start over, what would you do differently?
* *Reflection on teamwork:* For example, what went well or less well in the team assignments? What were some of the main challenges you faced in teamwork? If you had to do this over, what would you change? What lessons have you identified for future team projects? If you already discussed all these issues in your Milestone 4 debriefing, your team mentor may waive this part.

**Grading:** The assignment is worth 83 points:

* [ ] 5pt: The report includes a description of the *process* used to identify the fairness requirements. The description covers (a) understanding potential fairness harms, (b) exploring bias in data and the sources of such bias, (c) identifying protected attributes, (d) negotiating conflicting fairness goals, and (e) considering how fairness interacts with other system goals (e.g. profits). The report then describes one fairness requirement for the system and one fairness requirement for the recommendation service. The answer includes a clear description of how achievement of the two fairness requirements can be assessed with a measure each. Both requirements are plausible.
* [ ] 5pt: The report includes a plausible discussion of how the system or development practices could be changed to improve the system with regard to each fairness requirement. Suggestions relate to at least one of (1) fairer data collection, (2) system design to mitigate bias, (3) process integration, and (4) monitoring and operation. If the report suggests to not take any action, a plausible justification is included.
* [ ] 5pt: For one of the fairness requirements, the system was analyzed with telemetry data to assess whether the requirement was met. The analysis is clearly described and the results are reported.
* [ ] 5pt: The report includes a description of the *process* used to anticipate feedback loops. At least two anticipated feedback loops with negative effects are described. All described anticipated feedback loops are plausible.
* [ ] 5pt: The report includes a plausible discussion of how the system or development practices could be changed to mitigate or break the feedback loop. If the report suggests to not take any action, a plausible justification is included.
* [ ] 5pt: For one of the anticipated feedback loops, the system was analyzed with telemetry data to assess whether the feedback loop is observable. The analysis is clearly described and the results are reported.
* [ ] 5pt: The report includes a description of the *process* used to identify possible security issues. At least two possible security issues are described. At least one of those issues relates to an attack on the recommendation model. All described security issues are plausible.
* [ ] 5pt: The report includes a plausible discussion of how the system or development practices could be changed to mitigate the security issue. If the report suggests to not take any action, a plausible justification is included.
* [ ] 5pt: For one of the anticipated security concerns, the system was analyzed with telemetry data to assess whether an attack is observable. The analysis is clearly described and the results are reported.
* [ ] 5pt: The report includes a description of the *process* used to identify possible safety concerns. At least two possible safety concerns are described. Both concerns relate to possible real-world harms. All described safety concerns are plausible.
* [ ] 5pt: The report includes a plausible discussion of how the system or development practices could be changed to mitigate the safety concerns. If the report suggests to not take any action, a plausible justification is included.
* [ ] 5pt: For one of the discussed safety concerns, the system was analyzed with telemetry data to assess whether harms occur. The analysis is clearly described and the results are reported.
* [ ] 20pt (individually): The team schedules a debriefing meeting within one week after submission of the milestone with their team mentor. The team members can convince the mentor that they understand their solution and that they have thought about the two reflection questions.
* [ ] 3pt (individually): The teamwork survey for this milestone is filled out.
* [ ] 3pt: Bonus points for social activity (see very end of this document)

## Final Presentation

**Learning goals:**

* Reflect on challenges building, deploying, and maintaining AI-enabled systems
* Reflect on challenges with regard to teamwork
* Effectively communicate technical decisions and summarize lessons learned

**Tasks:**  

*Project postmortem:* Reflect on the entire group project and discuss which decisions were hard and why, which decisions you would change in retrospect, and what you would do differently if you were building this for an actual company (probably with more time but also with higher stakes). Also reflect on your experience of working as a team.

*Presentation:* Create a 6-10 min presentation to the class presenting the project and your experiences. All team members should have an active role in the presentation. The presentation should cover at minimum (1) some key design decisions and (2) some reflection, but generally you are free to choose how you focus your presentation. 

**Technical details:** Good reflections are grounded in concrete experience and the specifics of the project. They avoid mere superficial statements, truisms, and AI slop. We are looking for honest reflections that are open about potential issues; we grade only the quality of the reflection, not the quality of the technical decisions or teamwork described in the reflection.

For the presentation, we recommend that you prepare slides and practice timing. The target audience for this talk is other teams in this class: Share what you did and what you learned or found interesting or challenging. Note that all teams worked on the same project, so you can assume familiarity with the task and do not need to introduce basics. Generally, discussions of interesting or unusual technical choices, of challenges overcome, and of reflection are more interesting than a standard description of the project.

**Deliverables:** Push your slides to GitHub and submit a link to the slides to Canvas.

**Grading:** This final step is worth 20 points:

* [ ] 10pt (individually): Participation in the project presentation event in the final exam slot and participation in your team's presentation.
* [ ] 10pt: A presentation given to the entire class that includes key design decisions and reflections on the entire project. The presentation is understandable to the target audience. Slides are uploaded to GitHub.
* [ ] 1pt: Bonus point if the presentation adheres to the 6-10min time limit.



## Bonus: Social Activities 

We hope that the following can encourage some social interaction that goes beyond the technical parts of the team project. This is entirely optional.

Team members can earn 3 bonus points in each milestone if they engage in an in-person social activity with their team that is **not** related to any coursework. This could just be an informal happy hour, playing a board game or computer game together, do a puzzle or trivia quiz, watch a movie, or whatever you like, as long as it is not course related. If you do, post a selfie to the public Slack channel **#social** and tag all team members who participated (who should all be visible in the selfie). Just taking a selfie outside the classroom does not count; do some recognizable social activity. You can also join forces with other teams if you are looking for some friendly competition, no constraints.

We accept posts throughout the entire period while you are working on the milestone, and until 3 days after the corresponding milestone submission, in case you want to use this to celebrate milestone completion.

## Bonus: Beyond the Comfort Zone 

You may divide the work in your team in whatever way you like. However, we encourage all team members to engage with topics beyond what they are already familiar with. For example, if a team member has previously used Prometheus for monitoring, they can likely do that part easily, but other team members may benefit from doing this as a new learning opportunity (possibly with the help of the experienced team member). 

In each milestone, your team can get up to 3 bonus points if you can convince your project mentor during the debriefing meeting that you went beyond your comfort zone. We are looking for two things: Allocate work beyond existing strengths/experience and be aware of all parts of the project. This typically requires assigning responsibilities in a way that does *not* mirror your prior strength/experiences, or explicitly pairing up team members with complementary strength. In addition, we expect that all team members can explain (roughly) the parts that others have done. Your project mentor may check commit logs and will ask follow up questions to check your claims and probe your understanding.
