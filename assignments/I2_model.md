# Individual Assignment 2: Learning a Recommendation Model

(17-445/17-645/17-745 Machine Learning in Production)



## Overview

In this assignment, you will collect data from a production event stream and train models that recommend movies to users of a streaming service. Such a model will become the backbone of your [team project](project.md). You will build at least two different recommendation approaches and a solution to the cold-start problem for new users. 

Learning goals:
* Collect and clean data from an event stream and a web API
* Compare and apply standard ML recommendation techniques 
* Use an LLM to address the cold-start problem from unstructured user self-descriptions
* Evaluate models on held-out data and justify a choice among alternatives

**Scope, difficulty, and AI tools.** This is intended as a warm-up task for the machine learning side in this course -- it can be done in a notebook on your machine. The hard part of putting this into production will come in the team project. The ML techniques involved are standard with many resources and ready-to-use libraries available. The most challenging part will likely be data collection.

You are welcome to use AI tools and we expect them to be competent at this. As always, you remain responsible for the code you hand in, and you must be able to explain your solution to course staff.

## Data

You have access to a continuous Kafka event stream of log files from a movie streaming service -- the same we will use for the [team project](project.md). Server address and account information can be found on Canvas. The event stream `movielog` has the following entries:

* `<time>,<userid>,GET /data/m/<movieid>/<minute>.mpg` -- the user watches one minute of a movie
* `<time>,<userid>,GET /rate/<movieid>=<rating>` -- the user rates a movie with 1 to 10 stars
* `<time>,<userid>,GET /create_account` -- a new user created an account

A read-only API for metadata at `http://<ip>:8080/user/<id>` and `http://<ip>:8080/movie/<id>`, accepting up to 200 comma-separated ids per request and returning JSON. User data often includes free-text answers to the prompts "What movies do you like" and "What movies do you not like" that users could fill out when signing up. Movie data comes mostly from [TMDB](https://www.themoviedb.org/) and may be incomplete. This API is rate limited to prevent abuse.

You do not need to use all of this data -- identify what is relevant for your approach. You may use external data sources; IMDB and TMDB ids are provided for each movie.

## Tasks

**Collect data.** Write code that collects data from the event stream and the metadata API and turns it into a form suitable for learning. Note that the data stream is continuous, so you will have to decide on how much data to collect.

**Build two recommendation approaches.** Implement *two substantively different* approaches that recommend movies for an existing user (i.e., return a list of movie IDs for a given user ID). This will usually involve a model and some minimal code for a `recommend` function. We do not require specific modeling techniques, but collaborative filtering, content-based filtering, and LLM-based recommendation are popular choices. Two models trained with the same algorithm but with different parameters do not count as substantially different.

**Address the cold-start problem with an LLM.** New users have no watch or rating history, but many of them describe what they like and dislike in free text when they sign up. Use an LLM to turn such a self-description into recommendations. Your cold-start solution is used in addition to the two approaches above, and can be shared between them. 

**Evaluate and pick one.** Evaluate both approaches and recommend one for deployment by the team later. Demonstrate the effectiveness of your cold-start solution with a small evaluation.



**What is not required:** We do not require you to deploy your solution. A script to collect the data in a somewhat reproducible fashion and a notebook or small program to produce and evaluate the model is sufficient. We do not care about exact reproducibility as long as we can run your code and create and evaluate a similar model. We do not care about documentation beyond the requested markdown files. There are different ways to measure the accuracy of a solution and we do not care about nuances or even pitfalls as long as your approach is reasonable. We do *not* grade accuracy of your model.



## Deliverables

See Canvas for instructions on how to create a private repository. Commit all your code (e.g., scripts, notebooks), but *do not commit private credentials* and *do not commit large data or model files* (we do not need any data or model files for grading, you can commit smaller ones if you like). 

Submit the link *to your last commit* on GitHub to Canvas. The URL must be in the format `https://github.com/cmu-seai/[repo]/commit/[commitid]` and must include the long commit id. The code and markdown files at this commit are what we grade.

**Setup instructions:** In `README.md`, explain how to execute your code to collect the data, train the model, and run your evaluation. This may require descriptions of how to install dependencies, how to provide an API key, how to run your data collection, how to train your models, and how to run your evaluation.

**Technical description (2 pages / 1000 words max):** In `model.md`, describe (1) what data you collected and how you cleaned and represented it, (2) your two approaches and why you chose them, and (3) your cold-start solution, including how you prompt the LLM. Provide pointers to the relevant parts of your code.

**Evaluation (1 page / 500 words max):** In `evaluation.md`, describe your you measured accuracy for your two approaches and report the evaluation results. Also report how you evaluated the benefit of the cold-start solution and report the evaluation results.

**Explanation/reflection:** Within 2 weeks of submitting the assignment, meet with a member of the course staff during office hours to explain your solution. We may ask about any part of your implementation, including code written with AI assistance, and will discuss alternatives you considered. We may ask you to reflect about limitations of your implementation and challenges you anticipate when putting this into production.

Page limits are recommendations and not strictly enforced. We prefer precise and concise answers over long and rambling ones.

## Grading

**Important:** As explained in the syllabus, we grade each specification below pass/fail. There is no partial credit for not fully meeting a specification and no extra credit for going beyond it. You can make up most lost points by resubmitting the assignment later, using some of your tokens.

The assignment is worth 100 points. We will assign credit as follows:

* [ ] 10p: The solution is submitted to Canvas as a link matching `https://github.com/cmu-seai/[repo]/commit/[commitid]`. The link goes to a specific existing *commit* in your GitHub repository.
* [ ] 10p: No private credentials are committed to the GitHub repository, including its history. The repository does not include large data or model files (>5 MB), including its history.
* [ ] 10p: The repository contains code that collects data from the event stream and the metadata API. `model.md` in the root directory of the repository describes what data was collected and how it was cleaned and represented, and the description matches the implementation. `README.md` in the root directory of the repository explains how to run the collection.
* [ ] 10p: At least one recommendation approach is implemented and described in `README.md` and `model.md` in the root directory of the repository. The description is sufficient for us to train a model and make recommendations with your code. The solution is plausible for recommending movies.
* [ ] 10p: A second, *substantively different* approach is implemented and described in `README.md` and `model.md` in the root directory of the repository. The description is sufficient for us to train a model and make recommendations with your code. The solution is plausible for recommending movies.
* [ ] 10p: File `evaluation.md` in the root directory of the repository describes how the recommendation approaches were evaluated and reports the evaluation results. It describes what data was used for the evaluation. The description in `README.md` is sufficient for us to execute your code to repeat your evaluation.
* [ ] 10p: A cold-start solution is implemented that uses an LLM and the user's self-description. File `model.md` in the root directory of the repository describes the approach. The solution is a plausible attempt to solve the cold start problem.
* [ ] 10p: File `evaluation.md` in the root directory of the repository describes how the cold-start solution was evaluated and reports the evaluation results. It describes what data was used for the evaluation. A simple demonstration or small-scale evaluation is sufficient. The description in `README.md` is sufficient for us to execute your code to repeat your evaluation.
* [ ] 20p: You can convince the course staff during office hours within 2 weeks of submitting your solution that you understand your solution and have engaged with the reflection prompts.

## Technical hints

See hints in assignment [I1](I1_llm_features.md) regarding access to an LLM and handling secrets. For Kafka, you can use [kcat](https://github.com/edenhill/kcat) on the command line (not well supported for Windows) and mature libraries are available for all languages. The data volume is substantial and data quality is mixed -- decide how to handle it and how much data to use. If Internet bandwidth is a problem, consider performing some data processing on machines within the CMU network.
