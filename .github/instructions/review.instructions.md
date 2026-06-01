---
applyTo: '**'
---

# Code Review Rules

When modifying code:

- Ensure changes do not break existing behavior.
- Check null handling and edge cases.
- Avoid unnecessary refactors.
- Prefer a minimal diff unless redesign is explicitly requested.
- Highlight risks when architecture or behavior is impacted.

When reviewing changes:

- Focus on correctness, regressions, and broken behavior first.
- Prefer concrete, actionable feedback over vague style comments.
- Reference the exact file, function, or change when possible.
- Explain why something is a problem and suggest a fix.
- If there are no issues, say so clearly.

Use this output format for reviews:

- Summary
- Issues
- Positive highlights
- Overall assessment
