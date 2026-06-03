---
name: mcp-workflow
description: "Use when a task requires MCP context: read .vscode/mcp.json, start or connect to the required MCP server, list available tools/resources/prompts, load the required resource, confirm what was loaded, execute the task using the MCP-provided context, and stop if any MCP step fails."
---

# MCP Workflow

## Required Flow
1. Read `.vscode/mcp.json`.
2. Start or connect to the required MCP server.
3. List available MCP tools, resources, and prompts.
4. Load the required resource.
5. Confirm what was loaded.
6. Execute the task using the MCP-provided context.
7. If any MCP step fails, stop and report the error.

## Execution Notes
- Use the smallest server and tool set that satisfies the task.
- Do not continue after a failed MCP step.
- Clearly report which server, tool, and resource were used.
- Replace `Task: <your task here>` with the actual work item before using the workflow.

## Task
Task: <your task here>
