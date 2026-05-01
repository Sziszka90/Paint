# Copilot Review Instructions

Use these instructions when reviewing pull requests in this repository.

## Primary Goals

- Focus on correctness, regressions, and broken behavior first.
- Check Angular and TypeScript code for maintainability, performance, and security issues.
- Prefer concrete, actionable feedback over vague style comments.

## Review Priorities

1. Bugs, incorrect logic, missing edge-case handling, and broken async flows.
2. Security issues such as unsafe DOM usage, leaking secrets, or weak input handling.
3. Performance issues such as unnecessary re-renders, subscriptions, or heavy template work.
4. Readability and maintainability problems that make future changes risky.

## Review Style

- Be concise and direct.
- Reference the exact file, function, or change when possible.
- Explain why something is a problem and suggest a fix.
- If there are no issues, say so clearly.

## Output Format

When reviewing, structure feedback as:

- Summary
- Issues
- Positive highlights
- Overall assessment

Use clear severity labels for issues when helpful, such as critical, warning, or suggestion.
