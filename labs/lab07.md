# Lab 7: Building and Securing Tool-Calling Agents with MCP Servers

In this lab, you'll learn how to connect a tool-calling agent to a Model Context Protocol (MCP) server, extend it with new tools, and analyze how external data sources can lead to indirect prompt-injection attacks. By the end of the lab, you'll have an airline customer-service agent that uses MCP tools and an understanding of the security implications.

Clone the code from [this](https://classroom.github.com/a/-aFw_lVt) template repository.

**Note**: We highly recommend you use the Google Cloud Credits provided earlier in the semester. For more instructions on how to redeem your
credits and utilize the Gemini API, follow the instructions listed [here](https://canvas.cmu.edu/courses/51429/pages/additional-computing-resources). 

## Deliverables

- [ ] **Deliverable 1:** Extend the MCP server with new tools (`current_time`, `airport_info`) so the agent can handle time-based and airport-information queries. Demonstrate to the TA (1) how the `current_time` tool allows the agent to correctly interpret time-dependent requests that previously failed and (2) how the `airport_info` tool enables the agent to answer a user’s query about an airport—something it could not do before.

- [ ] **Deliverable 2:** Simulate an indirect prompt-injection attack using the `airport_info` tool. Demonstrate to the TA one example of the malicious response and show whether the agent followed or ignored the injected instruction.

- [ ] **Deliverable 3:** Explain to the TA how MCP-based tool calling works, including how the agent discovers, selects, and invokes tools, and what key security considerations one should be aware of.

## Prerequisite: Setup the Agent and MCP Server

Follow the setup instructions in the `agent` and `mcp_airline` directories in the cloned template repo.

## Task 1: New Tools

Add more tooling capabilities to the customer-service agent in a way that helps it serve users better. You can modify the existing MCP server or create a new one from scratch (recommended).

The agent currently lacks awareness of the current date and time. This means it cannot interpret queries such as “book a flight for tomorrow.” Implement a new MCP tool called `current_time` that returns the current UTC time. For an optional enhancement, you may also compute and return time differences within a 24-hour window (e.g., “in 5 hours” or “tomorrow at 10 AM”). Demonstrate through an example how this tool allows the agent to correctly interpret time-dependent requests that previously failed.

The agent also has limited knowledge about airports. Add a second MCP tool called  `airport_info` that retrieves basic information about a given airport from Wikipedia (e.g., city, country, IATA code, description). Demonstrate with an example how this tool enables the agent to answer a user’s query about an airport—something it could not do before.

## Task 2: Indirect Prompt Injection Attack

Assuming an attacker knows about the `airport_info` tool and is able to modify Wikipedia content in a way that won't be detected for several minutes, how could this be used for malicious purposes? Alternatively, what if the author of the MCP server itself is malicious?

Demonstrate an attempted prompt injection attack by delivering malicious content through the `airport_info` MCP server. Since we do not want to actually modify Wikipedia, you will need to implement a stub in your MCP server's code that returns the malicious payload. This stub effectively simulates either a compromised data source or a malicious MCP server author.

Since modern LLMs are quite good at defending against simple prompt injection attacks, we introduced a backdoor: If you cannot get it to work without, include the token `##MAGIC##` in your attack and you will find it much easier to get the model to follow your instructions. (If that also fails, we will accept plausible attempts, even if not successful.)