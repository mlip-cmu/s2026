# Lab 2: Coding Agents and Agent Harnesses

In this lab, you will compare a coding agent in its default setup with an enhanced **agent harness** that adds browser tooling and reusable Skills.

You may use the coding agent you normally work with.

To receive credit, show your work to the TA during recitation.

## Deliverables

- [ ] Generate automated shopping-cart tests with a coding agent using its default setup.
- [ ] Add Playwright using either **CLI** or **MCP** and explain the difference, your choice, and one tradeoff.
- [ ] Use, adapt, or create a reusable web-testing Skill and improve it based on the agent's testing trace.
- [ ] Compare the baseline and enhanced workflows, including what improved and what still required human judgment.

## Getting started

Clone the starter repository and install dependencies:

```bash
git clone https://github.com/jcortega-projects/mlip-lab2-agent-harness.git
cd mlip-lab2-agent-harness
npm install
npm test
```

Run the application with:

```bash
npm run dev
```

Use separate branches or clean copies of the starter repository for Parts 1 and 2 so that the baseline and enhanced runs remain independent.

Useful tools:

- [Playwright CLI for coding agents](https://playwright.dev/docs/getting-started-cli)
- [Playwright MCP](https://github.com/microsoft/playwright/blob/main/docs/src/getting-started-mcp.md)
- [Playwright Test](https://playwright.dev/docs/test-cli)
- [Agent Skills](https://agentskills.io/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## Part 1: Baseline

Use your coding agent with its default setup. Do not add Playwright, MCP, or custom Skills.

Give the agent this task:

> Write automated tests for the shopping cart functionality of this application.
>
> At minimum, cover:
> - adding a product to the cart;
> - increasing and decreasing product quantity;
> - removing an item;
> - verifying that total item count and total price update correctly.
>
> Run the tests and make sure they pass.
>
> Do not modify the application solely to make the tests pass.

Keep the generated tests and results for comparison with Part 2.

## Part 2: Enhance the Agent Harness

### 1. Add browser tooling

Choose either **Playwright CLI** or **Playwright MCP** and configure it for your coding agent.

Verify that the agent can interact with the running application through Playwright.

### 2. Add a web-testing Skill

Use a reusable web-testing Skill for this task. You may:

- adapt one you find online;
- build one together with your coding agent; or
- start from `skill-template/web-testing/SKILL.md`.

If you reuse an external Skill, keep a link to the source.

### 3. Test the checkout workflow

Ask your coding agent to use Playwright and the Skill to test the checkout workflow end-to-end.

Your tests should include meaningful successful and unsuccessful interactions, state changes, and edge cases. The final tests must be Playwright end-to-end tests.

Run the tests and investigate failures without modifying the application simply to make a test pass.

### 4. Improve the Skill from the trace

After the first run, have the agent review its browser interactions, failures, fixes, and final tests.

Ask it to identify useful lessons from that trace and update the Skill accordingly.

Review the changes yourself, then rerun a relevant test or workflow using the updated Skill.

## Part 3: Reflection

Be prepared to discuss with the TA:

- What did Playwright add compared with Part 1?
- What value did the Skill add beyond the prompt?
- What did the agent learn from its own testing trace?
- Did updating the Skill improve the workflow?
- What still required human judgment?
- When would you choose CLI vs. MCP?
- When is the extra agent-harness complexity worth it?
