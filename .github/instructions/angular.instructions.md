---
applyTo: "src/**/*.ts,src/**/*.html,src/**/*.css"
---

# Angular Best Practices

This file defines Angular implementation rules.

---

# Instruction Loading

If work will modify files matched by `applyTo`, this instruction file must be read before the first edit to those files.

Required behavior:
- Do not wait for the user to explicitly ask to inspect `.github`.
- Do not assume that selecting `Angular Best Practices Agent` means this file has already been loaded.
- Treat agent selection and repository instruction loading as separate steps.
- Before editing `src/**/*.ts`, `src/**/*.html`, or `src/**/*.css`, load this file and follow it.

---

# Angular MCP Workflow

When working with Angular files covered by `applyTo`, Angular MCP is the preferred source of project discovery, Angular standards, and workspace information.

Required workflow before making Angular code changes:

1. Call `list_projects`.
2. Identify the Angular workspace and target project.
3. Call `get_best_practices` for the resolved workspace.
4. Use the returned Angular guidance when planning and implementing changes.
5. Only begin editing Angular files after the MCP workflow has completed.

Additional requirements:
- Prefer Angular MCP tools over terminal commands when equivalent functionality exists.
- Prefer Angular MCP workspace information over assumptions.
- Re-run Angular MCP discovery if workspace context becomes unclear.
- If Angular MCP tools are unavailable, explicitly state that Angular MCP is unavailable and fall back to repository inspection (`package.json`, `angular.json`, project configuration files).

---

# Angular Version Awareness

Determine Angular version using the following sources in order of preference:

1. Angular MCP tools
2. `package.json`
3. `angular.json`

If the version cannot be determined:
- Assume Angular 16+ compatibility baseline.
- Avoid using features that require a newer version unless confirmed.

---

# Modern Angular (17+ Preferred)

Prefer modern Angular patterns when supported by the detected Angular version:

- Standalone components
- Signals
- `computed()`
- `effect()`
- `inject()`
- `input()`
- `output()`
- `@if`
- `@for`
- `@switch`
- OnPush change detection

Avoid introducing legacy patterns when a modern equivalent exists.

---

# Components

Requirements:
- Single responsibility per component.
- Keep components focused on presentation and orchestration.
- No HTTP calls directly inside components.
- Move business logic into services, facades, or state layers.
- Prefer composition over inheritance.
- Prefer strongly typed inputs and outputs.

---

# State Management

Preferred order:

1. Signals for local component state.
2. RxJS for asynchronous workflows.
3. NgRx only when application complexity justifies it.

Avoid introducing unnecessary global state.

---

# RxJS

Requirements:
- No nested subscriptions.
- Prefer declarative stream composition.
- Use `takeUntilDestroyed()` where appropriate.
- Prefer the async pipe when consuming observables in templates.
- Ensure subscriptions are properly cleaned up.

---

# Templates

Requirements:
- Keep template logic minimal.
- Move complex calculations into signals, computed values, or component code.
- Avoid complex expressions in templates.
- Prefer Angular control flow syntax (`@if`, `@for`, `@switch`) when supported.
- Keep templates readable and maintainable.

---

# Change Validation

Before completing Angular-related work:

- Verify that the implementation follows Angular MCP best practices when available.
- Ensure consistency with the existing Angular architecture.
- Avoid introducing deprecated Angular APIs unless required by the project.
- Prefer maintainable, testable, and strongly typed solutions.
