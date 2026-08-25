# Individual Assignment 2: Risks and Mitigations

(17-445/17-645/17-745 Machine Learning in Production; 11-695 AI Engineering)

## Overview

In this assignment, you will zoom out from the ML component and think about risks and how to mitigate them for an ML-powered system in a concrete scenario. We will use several approaches to proactively think about risks through the lens of requirements and safety engineering, for some of which you will build your own tooling.

Learning goals:
* Understand the role of the environment and environmental assumptions in system risks and establishing system requirements
* Consider multiple different mitigation strategies in the system design to eliminate or reduce risks
* Design reliable measures for qualities of interest
* Apply hazard analysis to anticipate risks
* Apply FTA to understand risks and plan mitigations in an AI-enabled system
* Understand the strengths and limitations of these techniques.
* Discuss the benefits and risks of (partially) automating hazard analysis.

## Scenario

[Dashcams](https://en.wikipedia.org/wiki/Dashcam) are getting more popular and are installed in many vehicles already. You are a software engineer at a commercial manufacturer of dashcams, who sells directly to end consumers, but also to automotive manufacturers. You want to develop features that distinguish your dashcams from those of your competitors. As one project, you work with a non-profit organization on *child safety*: The project's goal is to use dashcam footage to locate children reported missing. However, instead of broadcasts, such as [Amber alerts](https://en.wikipedia.org/wiki/Amber_alert) your products will allow  searching for those children in video recordings made by the dashcam.

Your company is contracting out the *person recognition model*, the AI component that recognizes persons in images and video to another company with extensive experience in face recognition based on deep neural networks (including face recognition in distorted images and in low-light conditions). The contractors build on past tools and infrastructure (e.g., [Amazon Rekognition](https://aws.amazon.com/rekognition/)) but will customize one or multiple components to your needs, to the extent possible (e.g., deploying models offline would be an option). They will provide you with the infrastructure to fine-tune and serve person recognition models, which you can operate and update yourself.

In designing such a system, there are many considerations, such as:
* Your dashcams do not have direct internet access, but they can communicate over USB, Bluetooth or Wifi with phones, cars, and wifi-hotspots.
* The dashcams may run on battery, but are usually connected to the car's power supply, at least while the car is running. Their processing power differs from model to model.
* Searches are coordinated with the authorities and the non-profit organization. You suspect less strict requirements than for Amber alerts, but the legal details are not worked out yet. Searches are likely not very frequent in any given area. For Amber alerts, [official statistics](https://amberalert.gov/statistics.htm) report about 1 alert per day *nationwide*.
* Faster reports of sightings are more useful to the authorities.
* You suspect users may be worried about privacy and charges for data.
* You recently hear everywhere, including press and consultants, how exciting the future of [Edge computing](https://en.wikipedia.org/wiki/Edge_computing) (rather than Cloud computing) is going to be and wonder whether you should explore that. Your management is open to thinking about partnering with other organizations to, say, install hardware in gas stations or drive-throughs.

## Analysis Steps

The main goal of this assignment is to anticipate and proactively mitigate risks in the system, using approaches from requirements and safety engineering. You will build your own custom tools to automate part of the analysis. We guide this through six steps, of which we want you to support steps 2-4 with LLM-based automation.

1. Understand the goals of this project, especially the goals of the different stakeholders and how they may or may not align with the system and model goals. For this assignment, explicitly break down goals into *organizational goals* (from the perspective of the dashcam company), *system goals* (for the new feature), *user goals* (for at least 3 different direct or indirect stakeholders), and *model goals* (for the person recognition model). Your list of goals should be reasonably comprehensive and may include multiple goals at each level. Provide a brief description of how goals relate to each other (e.g., “better model accuracy should help with higher user satisfaction”). To ensure that the goals are concrete and measurable, design a *measure* for one goal from each category that you could use to assess how well you achieve those goals. The measures could be described in the 3-step process (measure, data, operationalization, as we discussed in the *Model Accuracy* lecture) with sufficient precision for others to conduct the measurement independently, manually or automatically. 
2. Identify direct and indirect stakeholders who care about or are affected by the system and the new feature (in addition to the stakeholders you may have already considered in Step 1).
3. Identify risks using the early steps of an STPA-style analysis, as introduced in class: Identify values and goals per stakeholder, identify possible losses, and turn those into requirements (REQ). Focus on risk related to specific harms for the stakeholder you analyze. 
4. Analyze the requirements that you consider as important with a critical focus on assumptions the system designers may wrongly make (e.g., assumptions that seem plausible, but may not actually always hold in production). For each requirement, list plausible assumptions about the environment (ASM) commonly made that are needed to achieve this requirement. Also identify the responsibilities (SPEC) of the software components (both AI and non-AI) that are needed to establish the REQ in conjunction with ASM. 
5. For an important requirement, think more systematically about what could go wrong using fault tree analysis. Start with the top event for the violation of the requirement and break it into intermediate and basic events (which may correspond to a violation of an environmental assumption or an AI component making mistakes). The fault tree should cover possible violations of assumptions and specifications from the previous step (if plausible), but can include additional information.
6. Finally, describe at least two strategies for mitigating the risks of potential failures for the analyzed requirement and incorporate them into an updated version of the fault tree. Mitigation strategies will typically be at the system level, outside of the AI component itself, and will reduce the risk of the requirement violation. Briefly explain how each suggested mitigation strategy can (partially or fully) address the risk.


We suggest that you try to go through the steps above manually first for a small number of stakeholders and requirements before you attempt automation.


## Automation

The use of LLM-based automation in safety analysis is controversial. On the one hand it can scale the analysis and reduce costs, making it more likely that developers actually do it. On the other hand, it can lead to shallow analyses with limited domain expertise.

For this assignment, you will build some LLM-powered tooling to support steps 2-4 above. Given a description of the system, implement LLM assistance for identifying stakeholders, for identifying goals, values, losses, and requirements, and for analyzing those requirements. Also implement some support for filtering and prioritizing hazards. This will allow you to scale the analysis. 

For this assignment, we want you to do two things:

* Run the analysis at scale with your automation support, creating a report covering 10-20 stakeholders and their goals, 5-10 losses/requirements for each stakeholder, and 3-10 specifications/assumptions for each requirement. 
* Report key findings, focused on four results that you found important or surprising. Do not fully rely on LLM-generation and do not create an overwhelming amount of details that a developer would likely just ignore, but use your judgment to actively curate a small number of results that will be the most important to developers of the system.  

This does not need to be fully automated. In fact, we strongly recommend to create some human-in-the-loop iteration where developers can check and modify results at intermediate steps, rather than implementing a single fully automated end-to-end pipeline. You do not need to implement a user interface; a notebook or scripts are sufficient.

## Deliverables

See Canvas for instructions of how to create an empty private repository with GitHub classroom to which you will push all your code and results. Submit the link *to your last commit* on GitHub to Canvas. The URL must be in the format `https://github.com/cmu-seai/[repo]/commit/[commitid]`. Make sure that the link includes the long ID of the last commit. The code and various markdown files at this commit is what we will grade.

**Goals and measurement (2 pages/1000 words max):** In file `goals.md`, describe *organizational goals* (from the perspective of the dashcam company), *system goals* (for the new feature), *user goals* (for at least 3 different direct or indirect stakeholders), and *model goals* (for the person recognition model), and their relationship. For one goal of each category describe how you measure that goal using the three steps: measure, data, operationalization.

**Automation Code:** Commit all your code for your automation to your GitHub repository. Do not commit private credentials. In the `README.md` file, explain how to install and execute your automation code and how to use it (e.g., how to generate stakeholders, how to correct the list of stakeholders before analyzing their values).

**Full report:** In file `analysis_results.md`, include a comprehensive risk report for the first four analysis steps, including at least 10 stakeholders and their goals and at least 50 losses/requirements and corresponding assumptions/specifications. The report should be legible to a software engineer who is familiar with the Dashcam system (i.e., no need for extensive explanations; focus on the results).

**Curated results (2 pages/1000 words max):** In file `key_results.md`, create a shorter report of *four* important or surprising losses and corresponding requirements you identified (and trace them back to stakeholders and their values/goals). For each of these four requirements list important corresponding environment assumptions (ASM) and specifications (SPEC) that are needed to establish this requirement (REQ). The curated results can be a part of the automatically generated results, but can also include information the automation did not suggest.

**Fault tree analysis and mitigations (0.5 pages/250 words and 2 figures max):** In file `fault_tree.md`:

1. Identify one requirement that relies on an ML model from the curated results for further analysis
2. Include a fault tree for this requirement by embedding/linking a graphic in png, jpg, svg, or pdf format in the markdown file. The fault tree should include all plausible violations of assumptions and specifications identified in the curated results for this requirement. It must include the wrong prediction of an ML model as one event in the tree. (For drawing fault trees, you may use any tool of your choice, such as Google Draw or [draw.io](https://app.diagrams.net/). A scan of a hand-drawn diagram is acceptable, as long as it is clearly legible. There are also dedicated FTA apps you could use; e.g., [Fault Tree Analyzer](https://www.fault-tree-analysis-software.com). We are not picky about the exact shapes in the notation as long as the connections are clear.)
3. Suggest two mitigation strategies to reduce the risk of the failure analyzed in the fault tree. Both mitigations should be at the system level, outside of the ML component (i.e., not just "collect more training data"). Briefly explain how the mitigations reduce the risk. 
4. Embed/link a second fault tree graphic that updates the first fault tree with those mitigations (e.g., add/remove events).

**Explanation/reflection:** Within 2 weeks of submitting the assignment meet with a member of the course staff during office hours to explain your solution. We may ask questions about your implementation or your curated results. In addition, we may engage you on the following reflection prompts: To what degree was the automation useful to you? How could it be improved, e.g., if your tool had access to source code of the Dashcam system? Did you find any results that were surprising to you? What would it take for you to adopt hazard analysis in your own projects?


Page limits are recommendations and not strictly enforced. You can exceed the page limit if there is a good reason. We prefer precise and concise answers over long and rambling ones.

## Grading

The assignment is worth 100 points. Solutions not submitted to Canvas as a link to a specific *commit* in your GitHub repository *created with GitHub classroom* will not receive any credit. For full credit, we expect:

* [ ] 10 points: A file `goals.md`  in the root directory of the repository contains a reasonably comprehensive list of organizational goals from the perspective of the dashcam company, system goals for the new feature, user goals for at least 3 different stakeholders, and model goals for the person recognition model. The relationship between these goals is described.
* [ ] 10 points: A file `goals.md`  in the root directory of the repository describes measures for at least one organizational goal, one system goal, one user goal, and one model goal. Each measure is clearly described in the 3-step method of measure-data-operationalization, with the information clearly associated with the correct step and with enough detail that somebody could independently conduct measurement.
* [ ] 20 points: A functional implementation of an LLM-powered tool to support the analysis can be found in the repository. A `README.md` file in the root directory of the repository explains how to install and execute the code (including how to provide API keys) and how to use it (e.g., to approve or correct the list of stakeholders). The repository does not contain API keys or other secrets.
* [ ] 10 points: A file `analysis_results.md`  in the root directory of the repository includes the results of a comprehensive analysis of the Dashcam system for at least 10 stakeholders and their goals and at least 50 losses/requirements, with corresponding assumptions and specifications. It is clear which goal relates to which stakeholder, which loss relates to which goal, which requirement relates to which loss, and which assumption and specification relates to which requirements.
* [ ] 10 points: A file `key_results.md`  in the root directory of the repository includes curated results, identifying exactly four important or surprising losses and corresponding requirements. Each loss is traced back to a stakeholder and their goal. For each requirement, corresponding assumptions and specifications are listed.  
* [ ] 10 points: The curated results in file `key_results.md`  in the root directory of the repository use the terms requirement, specification, and assumption correctly: The requirement mention only phenomena in the environment ("world"). All stated assumptions relate to phenomena in the environment or map those to shared phenomena accessible by the software ("machine"). All stated specifications mention only those phenomena in the interface between the environment and the software. The requirement, environmental assumption, and software specifications fit reasonably together and are plausible in the scenario.
* [ ] 10 points: A file `fault_tree.md` in the root directory of the repository includes a fault tree that shows possible causes behind the violation of one requirement from the curated list. The included fault tree is syntactically valid. The fault tree includes all plausible violations of assumptions and specifications identified in the curated results for this requirement. The fault tree includes a wrong prediction of a model as one event.
* [ ] 10 points: A file `fault_tree.md` in the root directory of the repository describes at least two mitigation strategies, corresponding to the selected requirement from the curated results. The description explains how the risk is reduced or eliminated by each mitigation. The mitigations are at the system level outside the ML component, rather than improving the reliability of the ML component itself. The mitigations are reflected correctly in an updated fault tree.
* [ ] 10 points: You can convince the course staff during office hours within 2 weeks of submitting your solution that you understand your solution and have engaged with the reflection questions.

## Technical hints

We provide no technical constraints on how you implement your automation. We expect the solution to be functional, but it does not need to be polished. You do not need to provide a user interface; solutions that expect the user to call scripts or functions or edit files are perfectly fine. It is also fine to hard-code the Dashcam scenario in constants or prompts. For example, Python code in a notebook is perfectly fine.

There are many web APIs that provide access to LLMs. You will typically have to sign up for an account. Some offer the API for free for a certain number of requests or at certain low request rates (see https://github.com/cheahjs/free-llm-api-resources), some provide free credits for students (e.g. [Azure for Students](https://azure.microsoft.com/en-us/free/students) from where you can access OpenAI models) -- this is sufficient to complete the assignment. You can also sign up for a paid API (e.g., [Claude](https://platform.claude.com/), [Gemini](https://ai.google.dev/), or [OpenRouter](https://openrouter.ai)); it is unlikely you will need more than $2 worth of credits for this assignment.





