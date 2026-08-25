# Individual Assignment 4: Explainability

(17-445/17-645 Machine Learning in Production)

## Overview

In this assignment you will consider how to explain a model and its decisions to end users. You will prototype global explanations and individual explanations. 

Learning goals:

* Understand and distinguish the different notions of transparency, interpretability, and explainability
* Explore explainability needs from the perspective of the end user
* Use state-of-the-art tools for model explainability to generate model and individual explanations
* Consider the need of end users, not just developers
* Interpret regulation and provide evidence to demonstrate compliance. Reflect on the difficulty of working with provided policies.

## Research in this Course

*We are conducting academic research on explainability policies and evidence. This research will involve analyzing student work of this assignment. You will not be asked to do anything above and beyond the normal learning activities and assignments that are part of this course. You are free not to participate in this research, and your participation will have no influence on your grade for this course or your academic career at CMU. If you do not wish to participate, please send an email to Nadia Nahar ([nadian@andrew.cmu.edu](mailto:nadian@andrew.cmu.edu)). Participants will not receive any compensation or extra credit. The data collected as part of this research will not include student grades. All analyses of data from participants' coursework will be conducted after the course is over and final grades are submitted -- instructors do not know who chooses not to participate before final grades are submitted. All data will be analyzed in de-identified form and presented in the aggregate, without any personal identifiers. The de-identified homework solutions (without grades) will be shared with research collaborators at Yale university for further analysis. If you have questions pertaining to your rights as a research participant, or to report concerns to this study, please contact Nadia Nahar ([nadian@andrew.cmu.edu](mailto:nadian@andrew.cmu.edu)) or the Office of Research Integrity and Compliance at Carnegie Mellon University ([irb-review@andrew.cmu.edu](mailto:irb-review@andrew.cmu.edu); phone: [412-268-4721](tel:4122684721)).*

# The Use Case: Diabetic Retinopathy Screening

The use case is to detect [diabetic retinopathy](https://www.nei.nih.gov/learn-about-eye-health/eye-conditions-and-diseases/diabetic-retinopathy) early with a special purpose ML-powered medical device. Diabetic retinopathy is a condition that can result in vision loss if left untreated. [AEYE Health](https://www.aeyehealth.com) is a comparable commercial offering.

Consider you are building a smartphone app, replacing current large commercial devices. The app will be used by trained users (nurses, volunteers) to perform screenings to detect potential problems simply by having patients look into the smartphone's camera through a specialized lens attachment (a small 3-d printed holder for a lens).

Deploying such medical diagnostics as a smartphone app and low-cost hardware extension has the potential to drastically reduce screening costs and make screenings much more available, especially in underresourced regions of the world. Instead of having to travel to a clinic with specialized equipment, trained users could perform screenings at mobile clinics or in patients' homes. The app would provide information about a potential risk and encourage the patients to get in contact with medical professionals for more accurate testing and potential treatment.

In this assignment, you will focus not only on the model, but also consider its integration into a smartphone app and its use for screening by trained users in underresourced regions (e.g., remote areas, high-poverty areas).

## The Policy

While government regulation is still evolving, the parent company that of the organization that creates the smartphone app has set an internal responsible AI policy to hold itself to high standards of responsible engineering. The policy is mandatory for all projects using machine learning (similar to what many other big companies in the tech and medical space have done). The following 8 points are the relevant parts of the policy:

**INTENDED USE** 

1. Describe the automated system’s intended use and the role of the automation (model). [*Guidance: Include its purpose, setting of use, and intended user(s). Include information about how the automated system may be used in combination with other information.*] 
2. Provide evidence that the automation (model) functions accurately, consistently, and effectively in the intended use case. [*Guidance: Evidence could take the form of accuracy testing disclosures, data from real-life tests of the tool, or independent review.*]

**HOW IT WORKS** 

3. Describe how the automation (model) works generally. Provide evidence that the documentation is effective for the policy purpose. [*Guidance: Where possible identify general mechanisms or factors that most strongly influence the automation.*]

4. Provide a mechanism to describe how the automation (model) worked with regard to an instance of use to all intended users and subjects affected by the automated system in a form that is accessible to them. Descriptions must include (1) that automation was used, (2) a short explanation of how the automation works, (3) what additional actors are involved in decisions, (4) what significant personal data was used for the decision, (5) what decisions were reached in a specific case. Provide evidence that the documentation is effective for the policy purpose. [*Guidance: Provide individual explanations using appropriate mechanisms, such as graphs, text-based explanations, counterfactuals, or SHAP plots.*]

**CONCERNS**

5. Describe limitations and misuse potential of the automated system beyond its intended purpose and any provided mitigations. [*Guidance: Identify concrete problems and assess their risks.*]

6. Describe the data used by the automated system. Justify the use of personal identifiable information.

7. Describe how to report misuse or harm from the automated system.

**LANGUAGE REQUIREMENTS**

8. Provide all documentation in language appropriate for the intended audience. All documentation for untrained users must use nontechnical language at an *eighth grade reading level*.

## Tasks

In this assignment, you will work with a provided model for a potential medical application ([diabetic retinopathy detection with a smartphone app](https://github.com/cmu-seai/diabetic-retinopathy)), understand explanation needs, and create end-user explanations, and demonstrate compliance with policy requirements. You will provide explanations for the stakeholders stated **on Canvas**. While we only provide the model and training/test data, assume that the model is embedded in a real-world software product as described above. 

**Understanding explainability needs.** Consider what the two stakeholders (see Canvas) might want to know about the product, the model, or the data (transparency). Consider their goals, such as understanding the system (as needed), using it responsibly, answering patient questions, or providing effective oversight ("human in the loop"). 

Consider using personas, chatbots with personas, hazard analysis, or interacting with actual people with experience in this role to understand their needs. Consider the model in the context of the software system and consider how that software system is embedded in the larger medical context. You likely will want to better understand the disease and the medical process for screening and treatment first, as well as challenges with deploying this in underresourced and remote areas.

**Global explanations:** To meet the previously identified explanation needs of the first stakeholder, create a PDF file `explanation_global.md` or `explanation_global.pdf` that includes information in a form that the company producing the product *may disclose in its handbook or website or advertising materials*. This might include information about the data, about accuracy, about important features, or about fairness -- you will likely write some code to produce relevant information for this document. You do not need to make up unrelated parts of the handbook/website/leaflet that have nothing to do with the model, such as how to turn on the device. Argue in your report why your solution is suitable for the intended stakeholder and their needs.

**Individual explanations:** Create explanations that you could give to the second stakeholder *on a display or as a printed handout after the screening*. Argue in your report why your solution is suitable for the intended stakeholder and their needs. Write code that produces explanations *for a specific input* for a patient, possibly automatically producing HTML pages from a template. Create a PDF file `explanation_local.md` or  `explanation_local.pdf`  (generated with code) that shows the explanations for *two* patients (example inputs) -- that is, concatenate the explanations for two selected patients in the same PDF. Provide brief instructions on how to run the code to create explanations for other inputs.

**Policy compliance:** In a file `compliance.md`, discuss whether your solution complies with the provided policy, separately for each of the eight policy requirements. Where possible provide evidence for compliance -- what you consider as evidence is for you to decide. Note that compliance is not necessary to receive full credit for this assignment. If you think that your solution does not comply or a policy requirement is not applicable, explain why and either (a) outline what additional work you could do to comply, (b) explain why compliance is not possible, or (c) why the policy requirement is not applicable. 

**Reflection:** Reflect on your experiences in this assignment, what you considered challenging, and what additional steps you might take if this you had to demonstrate policy compliance to a government agency (e.g. FDA). 



### Hints and guidance

A key goal is to provide explanations for the specified target audience and their needs when this system is deployed. Consider what these people might want to know and what they are likely to understand. Actively try to understand their perspective and how the model fits into the software and how that software fits into the medical system more broadly. You may want to conduct some internet research, talk to relevant people, or brainstorm with a chatbot. The goal is *not* to merely provide explanations that you wish you would receive or explanations for developers to debug the model. Less may be more.

This assignment is intentionally open ended. We interpret explainability broadly, including technical post-hoc explanations like SHAP, local and global explanations, nontechnical textual descriptions and traditional transparency mechanisms, such as audits and model and data disclosures. We have no specific requirements about approaches or techniques to include; make a judgment about what you think is needed and understandable to the intended target audience.

You can explore many different explainability and transparency techniques, including the ones discussed in class and in the lab and ones you find on your own. We recommend to rely on existing explainability tooling for nontrivial analyses rather than to develop your own. Many existing tools can generate plots that you can integrate into the websites you generate, but textual explanations are also perfectly acceptable. Think about what the target audience needs. We do not care about the visual quality of the generated files.

There is no single right explanation and we expect to see a very wide range of very different solutions. We are looking for a plausible solution where you argue why this solution is suitable and compliant, not any specific tool or design. 

## Deliverable

See Canvas for instructions of how to create a private repository with GitHub classroom that contains the starter code. Submit the link *to your last commit* on GitHub to Canvas. The URL must be in the format `https://github.com/cmu-seai/[repo]/commit/[commitid]`. Make sure that the link includes the long ID of the last commit. The code and various markdown files at this commit is what we will grade.

**Code:** Commit all relevant code to your GitHub repository, but do not commit private credentials. 

**Explanation needs (2 pages/1000 words max):** In a file `explanation_needs.md` in the root directory of the repository, describe the steps you took to identify explanation needs and provide some corresponding evidence (e.g., links to resources considered, links to chatbot transcripts, hazard analysis steps, personas). Separately describe the explanation needs you identified for the two different stakeholders mentioned on Canvas.

**Explanations (2 page/1000 words max):** Include two files `explanation_global.md/pdf` and `explanation_local.md/pdf` in the root directory of the repository. Additionally, in a file `explanations.md` in the root directory of the repository, briefly describe what kind of explanations you created (global and local) and link them to the previously identified explanation needs. Point out where we can find this explanation in `explanation_global.md/pdf` or `explanation_local.md/pdf` if it is not obvious. Provide links to code for creating the data or visualization used and point out specific techniques or tools, if you used any. Explain how we can produce local explanations for other inputs with your code.

**Compliance (4 pages/2000 words max):** In a file `compliance.md` in the root directory of the repository, discuss whether your solution complies with the policy requirement. If possible, provide evidence to demonstrate compliance. Write this as if you were submitting a short report to a compliance/legal team in your company to convince them that your product complies and can be released. If you cannot comply, think a policy rule is not relevant, or are unsure, discuss additional steps needed for compliance or explain why compliance may not be possible/relevant.

**Explanation/reflection:** Within 2 weeks of submitting the assignment meet with a member of the course staff during office hours to explain your solution. We may ask questions about your approach to identify information needs, your explanations, your implementation, and your policy compliance. In addition, we may engage you on the the following questions: What parts of this assignment and the policy were challenging? How would you approach policy compliance when it came to a government policy (e.g. FDA)?


Page limits are recommendations and not strictly enforced. You can exceed the page limit if there is a good reason. We prefer precise and concise answers over long and rambling ones.

## Grading

The assignment is worth 100 points. For full credit, we expect:

* [ ] 10 points: A file `explanation_needs.md` in the root directory of the linked repository describes the identified explanation needs separately for both stakeholders listed on Canvas. The process for identifying the information needs is described and some evidence is provided that the process was followed.
* [ ] 10 points: A PDF file `explanation_global.md` or `explanation_global.pdf` is included in the root directory of the linked repository that contains the global explanations (handbook/website/leaflet) for the first stakeholder. A file `explanations.md` in the root directory of the linked repository explains how this meets the previously identified explanation needs. The markdown/PDF file corresponds to the description in the report.
* [ ] 10 points: A PDF file `explanation_local.md` or `explanation_local.pdf` is included in the root directory of the linked repository that contains the individual/local explanations for the second stakeholder (display/handout) for *two* patients. A file `explanations.md` in the root directory of the linked repository explains how this meets the previously identified explanation needs. The PDF corresponds to the description in the report.
* [ ] 10 points: Code is provided that can provide local explanations for other patients. Instructions are clear on how to create additional local explanations.
* [ ] 10 points: The global and local explanations are clearly designed for the intended target stakeholders, rather than developers. A file `explanations.md` in the root directory of the linked repository explains how the provided explanations intend to meet the identified explanation needs of the stakeholders.
* [ ] 40 points (5 points each): In a file `compliance.md` in the root directory of the linked repository, for each of the following policy requirements (a) the answer describes how the requirement was addressed technically, (b) the provided PDF files illustrate the solution, and (c) the answer makes a good faith attempt at providing evidence to demonstrate compliance, or discusses additional steps needed for compliance, or explains why compliance may not be possible or applicable. 
  1. Describes the intended use and the role of the automation
  2. Provides evidence that the automation (model) functions accurately, consistently, and effectively in the intended use case
  3. Describes how the automation (model) works generally and provides evidence that the documentation is effective for the policy purpose. 
  4. Individual explanations that explain that automation was used, what significant personal data was used for the decision, and what decisions were reached in the specific case 
  5. Describes limitations and misuse potential of the automated system beyond its intended purpose and any provided mitigations.
  6. Describes the data used by the automated system. Justifies the use of personal identifiable information.
  7. Describes how to report misuse or harm from the automated system.
  8. Provides all documentation in language appropriate for the intended audience. All documentation for untrained users must use nontechnical language at an eighth grade reading level.
* [ ] 10 points: You can convince the course staff during office hours within 2 weeks of submitting your solution that you understand your solution and that you have engaged with the reflection questions.

