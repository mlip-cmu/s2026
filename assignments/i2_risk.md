# Individual Assignment 2: Risks and Mitigations

(17-445/17-645/17-745 Machine Learning in Production; 11-695 AI Engineering)

## Overview

In this assignment, you will zoom out from the ML component and think about about risks and how to mitigate them for an ML-powered system in a concrete scenario. We will use several approaches to consider proactively think about risks through the lens of requirements and safety engineering, for some of which you will build your own tooling.

Learning goals:
* Understand the role of the environment and environmental assumptions in system risks and establishing system requirements
* Consider multiple different mitigation strategies in the system design to eliminate or reduce risks
* Design reliable measures for qualities of interest
* Apply hazard analysis to anticipate risks
* Apply FTA to understand risks and plan mitigations in an AI-enabled system
* Understand the strengths and limitations of these techniques.
* Discuss the benefits and risks of (partially) automating hazard analysis.

## Scenario

[Dashcams](https://en.wikipedia.org/wiki/Dashcam) are getting more popular and are broadly installed in many vehicles already. As a commercial manufacturer of dashcams who sells directly to end consumers but also to automotive manufacturers, you want to develop features that distinguish your dashcams from those of your competitors. As one project, you work with a non-profit organization on *child safety*: The project's goal is to use dashcam footage to locate children reported missing. However, instead of broadcasts, such as [Amber alerts](https://en.wikipedia.org/wiki/Amber_alert) your products will allow to search for those children in video recordings made by the dashcam.

Assume that you are contracting out the AI component that recognizes persons in images and video to a company with extensive experience in face recognition based on deep neural networks (including face recognition in distorted images and in low-light conditions). The contractors build on past tools and infrastructure (e.g., [Amazon Rekognition](https://aws.amazon.com/rekognition/)) but will customize one or multiple components to your needs, to the extent possible (e.g., deploying models offline would be an option). They will provide you with the infrastructure to fine-tune and serve person recognition models, which you can operate and update in-house.

In designing such system, there are many considerations, such as:
* Your dashcams do not have direct internet access, but they can communicate over USB, Bluetooth or Wifi with phones, cars, and wifi-hotspots.
* The dashcams may run on battery but are usually connected to the car's power supply, at least while the car is running. Their processing power differs from model to model.
* Searches are coordinated with the authorities and the non-profit organization. You suspect less strict requirements than for Amber alerts, but the legal details are not worked out yet. Searches are likely not very frequent in any given area. For Amber alerts, [official statistics](https://amberalert.gov/statistics.htm) report about 1 alert per day *nationwide*.
* Faster reports of sightings are more useful to the authorities.
* You suspect users may be worried about privacy and charges for data.
* You recently hear everywhere, including press and consultants, how exciting the future of [Edge computing](https://en.wikipedia.org/wiki/Edge_computing) rather than Cloud computing is going to be and wonder whether you should explore that. You wouldn't be opposed to thinking about partnering with other organizations to, say, install hardware in gas stations or drive-throughs.

## Tasks

The main goal of this assignment is to anticipate and mitigate risks in the system, using tools from requirements and safety engineering, and building your own custom tools. We guide this through six steps, of which we want you to automate the first four steps:

First, identify direct and indirect stakeholders who care about or are affected by the system and the new feature.

Second, understand the goals of this project, especially the goals of the different stakeholders and how they may or may not align with the system and model goals. For this assignment, explicitly break down goals into *organizational goals*, *system goals*, *user goals* (for at least 3 different stakeholders; we accept generally goals of any stakeholder whether they are directly using the system or not), and *model goals*. To ensure that the goals are concrete and measurable, design a *measure* for one goal from each category that you could use to assess how well you achieve those goals. The measures could be described in the 3-step process (measure, data, operationalization, see Model Accuracy lecture) with sufficient precision for others to conduct the measurement independently, manually or automatically. Provide a brief description of how goals relate to each other (e.g., “better model accuracy should help with higher user satisfaction”). Organizational goals must be stated from the perspective of the dashcam company (not the partnering non-profits or authorities).  For user outcomes and model properties, make clear to which user(s) or model(s) the goal refer; you may state different goals for different users/models. Your list of goals should be reasonably comprehensive and may include multiple goals at each level.

Third, based on goals of different stakeholders perform hazard analysis to proactively identify possible risks from their perspectives. Since we are considering possible harms to specific stakeholders, we focus mostly on user goals. Follow the early steps of an STPA-style analysis, as introduced in class, to identify values and goals per stakeholder, identify possible losses, and turn those into requirements (REQ). 

Fourth, analyze the requirements with a critical focus on assumptions the system designers may make that do not actually hold. For the process, select a requirement of the system (REQ) from the previous step that seems important to get right and where an implementation will rely on at least one ML model. List plausible assumptions about the environment (ASM) commonly made that are needed to achieve this requirement. Also identify the responsibilities (SPEC) of the software components (both AI and non-AI) that are needed to establish the REQ in conjunction with ASM. 

Fifth, think systematically about what could go wrong for the same requirement and model it as a fault tree. Start with the top event for violating of the requirement and break it into intermediate and basic events (which may correspond to a violation of an environmental assumption or an AI component making mistakes). The fault tree should cover possible violations of assumptions and specifications from the previous step (if plausible), but can include additional information. 

Finally, describe at least two strategies for mitigating the risks of potential failures for the analyzed requirement and incorporate them into the fault tree. Mitigation strategies will typically be at the system level, outside of the AI component itself, and will reduce the risk of the requirement violation. Briefly explain how each suggested mitigation strategy can (partially for fully) address the risk.


We encourage that you try to go through the steps above manually first for a small number of stakeholders and requirements before you attempt automation.


## Automation

The use of LLM-based automation in safety analysis is controversial. On the one hand it can scale the analysis and reduce costs, making it more likely that developers actually do it. On the other hand, it can lead to shallow analyses with limited domain expertise.

For this assignment, you will (partially) automate the first four steps above using LLMs. Given a description of the system, implement LLM assistance for identifying stakeholders, for reflecting on goals, for identifying values, losses, and safety requirements, and for analyzing those requirements. This will allow you to scale the analysis to create 10-20 stakeholders and their goals, 5-10 losses/requirements for each stakeholder, and 3-10 specifications/assumptions for each requirement. Also implement some support for filtering and prioritizing hazards. Write the results of the analysis into a markdown file.

We strongly recommend to create some human-in the loop iteration where developers can check and modify results at intermediate steps, rather than implementing a single fully automated end-to-end pipeline. You do not need to implement a user interface, a notebook or scripts are sufficient.


## Deliverable

**Code and full results:** Push your automation code and the result of your automated analysis to the Git repository created with GitHub Classroom. The report (including at least 10 stakeholders and at least 50 losses/requirements) should be in the file `analysis_results.md` in the root directory and mostly self-explanatory. A `README.md` file should explain how to install and execute your automation code and how to interact with it (e.g., how to correct stakeholders).

**Report:** Submit a report as a PDF to Canvas, with the following sections:
1. *GitHub link*: Start the document with a link to your last commit on GitHub: On the GitHub webpage, click on the last commit message and copy the URL. The URL must be in the format https://github.com/cmu-seai/[repo]/commit/[commitid]. Make sure that the link includes the long ID of the last commit.
2. *Curated analysis results*: Report key findings, focused on a few results that you found important or surprising. Do not fully rely on LLM-generation and do not create an overwhelming amounbt of details that a developer would likely just ignore, but actively curate a small number of results that will be the most important to developers of the system. Specifically, curate *four* important or surprising losses and corresponding requirements you identified (and trace them back to stakeholders and their values/goals). For each of these requirements list important corresponding environment assumptions (ASM) and specifications (SPEC) that are needed to establish this requirement (REQ).
3. *Goal measurement* (2 pages max): Provide a concrete measure for at least one organizational goal, one system goal, one user goal, and one model goal.
4. *Risk analysis* (1 figure): Perform a fault tree analysis to identify potential root causes for the violation of one important requirement (from the curated list above) that relies on an ML model. The resulting fault tree should include all plausible violations of assumptions and specifications identified in the previous step. It must include the wrong prediction of an ML model as one event in the tree. (For drawing fault trees, you may use any tool of your choice, such as Google Draw or [draw.io](https://app.diagrams.net/). A scan of a hand-drawn diagram is acceptable, as long as it is clearly legible. There are also dedicted FTA apps you could use; e.g., [Fault Tree Analyzer](https://www.fault-tree-analysis-software.com). We are not picky about the exact shapes in the notation as long as the connections are clear.)
5. *Mitigations* (0.5 page max and 1 figure): Suggest at least two mitigation strategy to reduce the risk of the failure studied in the fault tree. Both mitigations should be at the system level, outside of the ML component (i.e., not just "collect more training data"). Briefly explain how the mitigations reduce the risk. Provide a second updated fault tree that includes those mitigations.

**Explanation/reflection:** Within 2 weeks of submitting the assignment meet with a member of the course staff during office hours to explain your solution. We may ask questions about your implementation or your curated results. In addition, we may engage you on the following reflection prompts: To what degree was the automation useful to you? How could it be improved, e.g., if your tool had access to source code? Did you find any results you found surprising? What would it take for you to adopt hazard analysis in your own projects?




Page limits are recommendations and not strictly enforced. You can exceed the page limit if there is a good reason. We prefer precise and concise answers over long and rambling ones.

## Grading

The assignment is worth 100 points. For full credit, we expect:

* [ ] 10 points: The report includes a link to a specific commit of your repository. That repository has a `README.md` file and a `analysis_results.md` file in the root directory.
* [ ] 20 points: A functional (partially) implementation of an automated analysis can be found in the repository. The `README.md` file explains how to install and execute the code (including how to provide API keys) and how to interact with it (e.g., to approve or correct the list of stakeholders). The repository does not contain API secrets.
* [ ] 10 points: The file `analysis_results.md` in the Git repository includes the results of a comprehensive analysis of the Dashcam system for at least 10 stakeholders and their goals and at least 50 losses/requirements, with corresponding assumptions and specifications.
* [ ] 10 points: The report includes curated results, identifying exactly four important or surprising losses and corresponding requirements. Each loss is traced back to a stakeholder and their goal. For each requirement, corresponding assumptions and specifications are listed.  
* [ ] 10 points: Goals in the report's "Goal measurement" section, a measure is provided for at least one organizational goal, one system goal, one user goal, and one model goal. Each measure is clearly described in the 3-step method of measure-data-operationalization, with the information clearly associated with the correct step and with enough detail that somebody could independently conduct measurement.
* [ ] 10 points: The curated results use the terms requirement, specification, and assumption correctly: The requirement mention only phenomena in the environment ("world"). All stated assumptions relate to phenomena in the environment or map those to shared phenomena accessibly by the software ("machine"). All stated specifications mention only those phenomena in the interface between the environment and the software. The requirement, environmental assumption, and software specifications fit reasonably together and are plausible in the scenario.
* [ ] 10 points: A fault tree that shows possible causes behind the violation of the requirement in the curated list. The included fault tree is syntactically valid. The fault tree includes at a minimum the violation of assumptions and specifications identified in the previous step (if plausible). The fault tree includes a wrong prediction of a model as one event.
* [ ] 10 points: At least two mitigation strategies, corresponding to the requirement, are described. The description explains how the risk is reduced or eliminated. The mitigations are at the system level outside the ML component. The mitigations are reflected correctly in an updated fault tree.
* [ ] 10 points: You can convince the course staff during office hours within 2 weeks of submitting your solution that you understand your solution and have engaged with the reflection questions.

