---
applyTo: "src/**/*.ts,src/**/*.html,src/**/*.css"
---

# Angular Best Practices

This file defines Angular implementation rules.

---

# Instruction Loading

If work will modify files matched by `applyTo`, this instruction file must be read before the first edit to those files.

Required behavior:
- Do not wait for the user to explicitly ask you to inspect `.github`.
- Do not assume that selecting `Angular Best Practices Agent` means this file has already been read.
- Treat agent selection and repository instruction loading as separate steps.
- Before editing `src/**/*.ts`, `src/**/*.html`, or `src/**/*.css`, load this file and follow it.

---

# Angular MCP Workflow

When the active agent is `Angular Best Practices Agent`, Angular MCP must be used for Angular project discovery and standards lookup whenever those tools are available.

Required workflow:
- Start with `list_projects` to identify the Angular workspace and project targets.
- Then call `get_best_practices` with the resolved workspace path before editing Angular files.
- Prefer Angular MCP tools over terminal commands for equivalent Angular CLI and workspace inspection tasks.
- If Angular MCP tools are unavailable in the session, say that explicitly and fall back to repository files such as `package.json` and `angular.json`.

---

# Angular Version Awareness

Always determine Angular version from:
- package.json
- angular.json
- Angular MCP tools (preferred)

If unknown:
- Assume Angular 16+ safe baseline

---

# Modern Angular (17+ preferred)

- Standalone components
- Signals
- computed()
- inject()
- input() / output()
- @if, @for, @switch
- OnPush change detection

---

# Components

- Single responsibility
- No business logic in UI layer
- No HTTP calls in components
- Prefer composition over inheritance

---

# State Management

- Signals for local state
- RxJS for async flows
- NgRx only if complexity requires it

---

# RxJS

- No nested subscriptions
- Use async pipe or takeUntilDestroyed
- Prefer declarative streams

---

# Templates

- Keep logic minimal
- Move computation into signals/computed
- Avoid complex expressions in HTML
