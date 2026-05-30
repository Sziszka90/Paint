---
applyTo: "src/**/*.ts,src/**/*.html,src/**/*.css"
---

# Angular Best Practices

This file defines Angular implementation rules.

---

# Angular Version Awareness

Always determine Angular version from:
- package.json
- angular.json
- MCP tools (preferred)

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
