# Individual Assignment 1: Building LLM-enabled Features for a Product

(17-445/17-645/17-745 Machine Learning in Production; 11-695 AI Engineering)

## Overview

In this assignment, you will enhance an existing product with a new feature powered by large language models. Building a system with an ML component requires more than training a model or writing a prompt. While sometimes central to the system, the ML component is typically just one part among many in a larger system. 

Learning goals:
* Demonstrate familiarity with programming skills necessary for this course
* Understand the scope of software engineering challenges when building a production system with ML components
* Identify technical and nontechnical challenges 
* Discuss user interface design decisions and risks introduced with the ML component

**A word on scope and difficulty and AI coding tools.** In this assignment, you will work with an existing mature code base of a web application. We do not expect that you know all the technologies involved, but we expect some basic programming skills as a prerequisite for this course and assume that you can quickly learn the necessary skills to make changes with documentation, tutorials, StackOverflow, or various AI tools. Incrementally modifying and maintaining existing systems is far more common than developing new things from scratch. Learning new technologies, libraries and tools and troubleshooting problems are important skills and a prerequisite to be successful in this class, especially in the team project. 

We recommend but do not require that you explore the use of AI coding tools for this assignment. The current generation of AI coding tools is unlikely to implement the required features fully automated without any human intervention, but they can be very helpful. We recommend to proceed in small steps in a working environment where you can easily test progress. Remember that even when using AI coding tools, we still expect that you are able to assure quality of your solution and can explain it; you are solely responsible for the code you hand in.

## Research in this Course
*For this class, we’re conducting research on student outcomes. This research will involve your work in this course. You will not be asked to do anything above and beyond the normal learning activities and assignments that are part of this course. You are free not to participate in this research, and your participation will have no influence on your grade for this course or your academic career at CMU. If you do not wish to participate or if you are under 18 years of age, please fill in the form: https://forms.gle/zn7PQgXA12bn3phM7. Participants will not receive any compensation. The data collected as part of this research may include student grades and homework solutions. All analyses of data from participants’ coursework will be conducted after the course is over and final grades are submitted. To minimize the risk of breach of confidentiality, the data used for analysis will not contain any personal identifiers, all data will be analyzed in de-identified and presented in aggregated form. Again, this research will not affect your grades, and the professor will not know who is participating in this research study until the grades are submitted. If you have questions pertaining to your rights as a research participant, or to report concerns to this study, please contact Christina Ma (qianouma@cmu.edu).*

## Tasks
You are going to extend [Zulip](https://github.com/zulip/zulip) with two new LLM-based features. Zulip is an open-source team collaboration tool somewhere between a ticket system and Slack-like discussion board. 

**Feature 1: Message Recap.** 
Zulip organizes conversations into streams and topics – it might be easy to miss important updates when you’re away. Implement a feature that uses an LLM to generate concise recaps of all unread messages on a single page. The recap should come with clickable references that jump directly to the original messages.

Record a short video demonstrating how this feature works from the user's perspective.

**Feature 2: Topic Title Improver.** Zulip topics can drift as conversations evolve, leaving titles stale, vague, or misleading. Implement a feature that uses an LLM to detect the topic to drift (e.g., sustained off-title discussion, new sub-thread emerging) and to then suggest a better title. The feature should detect drift soon after it occurs, ideally immediately when posting a message, because the user still has the context then. When implementing this feature, you should be conciencious of the associated cost and latency, and choose appropriate models and interaction models to trigger this feature. Design this feature such that it could plausibly used at scale without excessivle costs.

Record a short video demonstrating how this feature works from the user's perspective.


**Reflect on the feature in the product.** Machine learning contributes a part to a larger application with many non-ML parts and system-level concerns. When designing the features, think about how you introduce the features into the existing open source application, how they change the *user interface*, and what *risks* they introduce. Finally, anticipate *engineering issues* that might occur if you wanted to actually deploy Zulip with your features for production use, possibly supporting hundreds, thousands, or even millions of users. Make sure you are considering this in the context of the overall application, not just the model. 

Your discussions may reveal limitations and risks in your implementation and make suggestions for improvements. Even if you point out serious flaws in your own implementation, you are not required to implement the improvements if your implementation already meets our minimal requirements.


## Deliverables

See Canvas for instructions of how to create a private repository with GitHub classroom that contains the existing *Zulip* implementation.

**Code:** Commit all your code changes to your GitHub repository, but *do not commit private credentials*. 

**Installation instructions:** Replace the content of the `README.md` file in the root directory of the Git repository with instructions to install and run the system (unless you tell us otherwise we assume that we will start the development server with Vagrant). For example, explain how to get and provide an API token; if you add library dependencies make sure they are installed automatically or have clear instructions on how to install them. 

**Report:** Create a `report.pdf` file in the root directory of your Git repository with two sections:
* *Technical description (1 page max per feature):* Briefly provide a summary of how you implemented each feature with pointers to the relevant parts of the code, ideally as direct links to files or even to specific lines on GitHub. We prefer readable links in the PDF rather than hyperlinks behind text (e.g., https://github.com/mlip-cmu/f2025/blob/main/assignments/I1_mlproduct.md?plain=1#L46 rather than [this](https://github.com/mlip-cmu/f2025/blob/main/assignments/I1_mlproduct.md?plain=1#L46)). For each feature, record a short video to demo how it works in the user interface and provide a link (e.g., to an unlisted Youtube video or to zoom)
* *Statement on AI coding tools (0.5 page max):* Briefly describe whether and how you used AI coding tools and which. Briefly comment on helpful you fund them for this assignment and what obstacles you faced. We ask you not to use GenAI for creating this statement (e.g., a few honest bullet points with typos would be preferred over AI-generated slop).

(In this and all future assignments, page limits are guidance and not strictly enforced. You can exceed the page limit if there is a good reason. We prefer precise and concise answers over AI slop and long and rambling ones.)


**GitHub link:** Copy the link *to your last commit* on GitHub and submit it to Canvas. On the GitHub webpage, click on the last commit message and copy the URL. The URL must be in the format `https://github.com/cmu-seai/[repo]/commit/[commitid]`. Make sure that the link includes the long ID of the last commit. The code, readme, and report at this commit is what we will grade.

**Explanation/reflection:** Within 2 weeks of submitting the assignment meet with a member of the course staff during office hours to explain your solution. We may ask questions about your implementation and will engage you in a discussion about the reflection prompt above (e.g., risks, user interaction design, technical limitations).





## Grading

**Important:** Please read the grading specifications carefully. As explained in the syllabus, we grade each specification below pass/fail. That is, there is no partial credit when not fully meeting all parts of the specification and no extra credit for going beyond the specification. For example, if the feature is well described, but no video link is included, you will lose the full 20 points for the fourth specification. You can make up most lost points by resubmitting the assignment later, using some of your tokens, as described in the syllabus. 

The grading specifications should be clear enough that you should be able to evaluate yourself with high confidence whether your solution meets the specification. If you are not sure what is expected of you, please ask. In this, as in all future assignments, we are happy to answer clarification questions about the grading specifications. 

The assignment is worth 100 points. We will assign credit as follows:

* [ ] 10p: The report is clearly structured, such that it is clear which text belongs to which question. The document includes a link to a specific *commit* in your GitHub repository *created with GitHub classroom*. 
* [ ] 10p: We can install and run your implementation based on the descriptions in the `README.md` file (including instructions for dependencies and API creditials if needed).
* [ ] 10p: No private credentials are committed to the GitHub repository, including its history.
* [ ] 20p: The report describes how message recap is implemented and we can find the corresponding implementation. An LLM was used in the implementation. The application is functional in that it generates a summary every time a user requests recap. A video is recorded showing how a user will use the feature in the user interface.
* [ ] 20p: The report describes how topic title improver is implemented and we can find the corresponding implementation. An LLM was used in the implementation. The application is functional in that it suggests improved topic titles based on recent messages when topic drift is detected. A video is recorded showing how a user will use the feature in the user interface.
* [ ] 10p: The report contains a section on AI use, explaining whether, which, and how AI coding tools were used. One of the following is true: (a) no AI coding tool was used when creating the solution, (b) a VScode-based AI-coding tool was used and the Usage Monitoring extension was installed, (c) a VScode-based AI coding tool was used and you opted out of being in the research study, or (d) an AI coding tool was used outside of VScode. 
* [ ] 10p: You can convince the course staff during office hours within 2 weeks of submitting your solution that you understand your solution and have engaged in some depth with the reflection questions.



## Technical hints

*Development environment setup:* To set up the environment, follow the official [documentation](https://zulip.readthedocs.io/en/latest/development/setup-recommended.html). We strongly recommend to use their documented process with Vagrant and Docker and to then develop with VScode using remote development over SSH -- this will make it much easier to set up all the dependencies. The development environment is set up such that most changes are automatically reflected in the running server (`./tools/run-dev`).

*LLM use:* There are many web APIs that provide access to LLMs. You will typically have to sign up for an account. Some offer the API for free for a certain number of requests or at certain low request rates, some provide free credits for students -- this is sufficient to complete the assignment. We do not recommend to try to use an LLM locally, unless that's something you want to try anyway. When we tested the assignment, we had good experiences with the [Gemini API](https://ai.google.dev) (free, no credit card required). You might use [LiteLLM](https://www.litellm.ai) to make it easy to switch LLMs later.

*Handling secrets:* Never commit private credentials (such as API keys) to a public Git repository. A common strategy is to write credentials into a file (e.g., `api.key`), read the key from the file at runtime, add that file to the `.gitignore` file to avoid committing it accidentally, and add instructions to the README of how to obtain a key and how write it into a file. Alternatively it is common to pass API keys as environment variables. If you accidentally commit a key and push this to a public repository, you will need to revoke the key and create a new one; if you have not yet pushed the changes you can go the nontrivial route of [rewriting the git history](https://stackoverflow.com/questions/872565/remove-sensitive-files-and-their-commits-from-git-history). When we evaluate your submission, we will use our own API keys.

*Front-end development:* The most challenging part of this project will likely be to create a useable user interface, especially if you have limited prior experience with front-end web development. The Zulip project is big but well documented and well structured. AI coding agents can help with front-end development too, but we recommend proceeding slowly and incrementally, and checking results frequently.

*Video recordings:* You can record a video with Zoom or many other tools. You can provide a verbal description or text overlays to explain what is going on, but if it is clear from context what is happening, no audio or text is needed. We do not expect any sophisticated video editing; anything is fine as long as we can see the features in action. You will share the video as a link, for example, to a Zoom recording, to an unlisted Youtube upload, or to a file shared with Google drive or Box.com (which have plenty of storage with the Andrew Account). You may also post these videos publicly if you like, if you do not include implementation details.

*AI coding tools:* If you use AI coding tools, we suggest to work in small incremental steps and check and commit increments regularly. This [tutorial](https://github.com/skills/getting-started-with-github-copilot) might be useful for getting yourself familiar with AI-assisted development if you have not used GitHub Copilot before.

Modern AI coding tools can run test and the server to catch many of their own mistakes. You might find it useful to give the coding agent also the ability to look at the generated web pages with an MCP server like [Playwright MCP](https://github.com/microsoft/playwright-mcp).  

If you decide to use any forms of AI coding assistants in Visual Studio Code, we ask you to install a [usage monitoring extension]() plugin. This is purely for research purposes and will not affect your grades. With the extension installed, you will receive a report on your AI usage at the end of the semester, with recommendations on how to improve in the future.







