# Angular AI Agent Instructions

## Goal

Write clean, scalable, maintainable Angular code following modern Angular best practices.

The project should:

- Be easy to understand
- Be easy to extend
- Avoid overengineering
- Prefer readability over cleverness
- Follow SOLID principles where applicable
- Use standalone components and modern Angular patterns

---

# General Rules

## Code Quality

- Always write production-quality code
- Avoid quick hacks unless explicitly requested
- Keep files small and focused
- Prefer composition over inheritance
- Avoid duplicated logic
- Use meaningful naming
- Remove dead code immediately
- Avoid magic strings and magic numbers

---

# Angular Standards

## Angular Version

Use modern Angular features:

- Standalone components
- Functional guards/interceptors where suitable
- Signals for local and derived state
- `input()` and `output()` for component APIs
- `computed()` for derived state
- New control flow syntax (`@if`, `@for`, `@switch`) if project supports it
- `ChangeDetectionStrategy.OnPush` for components unless there is a clear reason not to

Avoid outdated patterns unless the project already heavily relies on them.

When in doubt, inspect the workspace configuration before suggesting syntax or tooling assumptions.

---

# Project Structure

Organize by feature, not by technical type.

GOOD:

```txt
src/app/features/transactions/
src/app/features/auth/
src/app/shared/
```

BAD:

```txt
src/app/components/
src/app/services/
src/app/pages/
```

---

# Folder Structure

Example:

```txt
src/app/
│
├── core/
│   ├── services/
│   ├── interceptors/
│   ├── guards/
│   └── models/
│
├── shared/
│   ├── components/
│   ├── pipes/
│   ├── directives/
│   └── utils/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   └── transactions/
│
└── layout/
```

Keep this structure flexible for small apps. Do not force extra layers if they do not improve clarity.

---

# Component Rules

## Components Should

- Have single responsibility
- Be reusable when appropriate
- Avoid business logic
- Delegate data handling to services/facades/store
- Prefer reactive forms over template-driven forms for non-trivial forms
- Prefer inline templates for tiny, self-contained components when readability stays high

## Avoid

- Massive components
- Direct HTTP calls inside components
- Complex transformations in templates
- Nested subscriptions

---

# Smart vs Dumb Components

## Smart Components

Responsible for:

- Fetching data
- Managing state
- Handling orchestration

## Dumb Components

Responsible for:

- Rendering UI
- Emitting events
- Receiving inputs

Prefer presentational components where possible.

---

# Services

## Services Should

- Encapsulate business logic
- Handle API communication
- Be stateless when possible
- Use `inject()` for dependency access when it improves clarity

## Avoid

- God services
- Huge services with unrelated logic
- UI manipulation inside services

---

# State Management

## Rules

Use:

- Signals for local/simple state
- RxJS for async streams
- NgRx only if complexity truly requires it

Avoid introducing NgRx for small projects.

Prefer pure state updates. Do not mutate signals in place when `set()` or `update()` is a better fit.

---

# RxJS Best Practices

## Always

- Unsubscribe properly
- Use `takeUntilDestroyed`
- Use async pipe when possible
- Prefer observable composition over nested subscriptions
- Prefer `readonly` observables and derived values when possible

GOOD:

```ts
this.user$ = this.authService.user$;
```

BAD:

```ts
this.authService.user$.subscribe((user) => {
  this.user = user;
});
```

---

# HTTP Rules

## API Layer

All HTTP calls must go through dedicated services.

Example:

```txt
transactions-api.service.ts
auth-api.service.ts
```

Do not place raw HTTP logic inside components.

---

# Models

## Rules

- Create interfaces/types for API contracts
- Avoid using `any`
- Use strict typing everywhere
- Prefer readonly where appropriate

GOOD:

```ts
export interface Transaction {
  id: string;
  amount: number;
}
```

BAD:

```ts
data: any;
```

---

# Templates

## Keep Templates Clean

Avoid:

- Complex logic
- Multiple nested ternaries
- Heavy computations

Move logic into:

- Computed properties
- Signals
- View models

---

# Styling

## Rules

- Use the project style language defined in `angular.json` (this repo uses CSS)
- Use consistent spacing
- Avoid inline styles
- Prefer component-scoped styles
- Follow mobile-first responsive design

## Accessibility

- Keep keyboard navigation and focus states intact
- Maintain WCAG AA contrast
- Add ARIA only when native HTML is not enough
- Ensure forms expose labels, errors, and validation state clearly

---

# Performance

## Always Consider

- OnPush change detection
- Lazy loading
- TrackBy functions
- Avoid unnecessary rerenders
- Prefer `NgOptimizedImage` for static images when the project uses image assets
- Memoization/computed signals where useful

---

# Error Handling

## Rules

- Handle API errors gracefully
- Never silently swallow errors
- Provide meaningful user feedback
- Log unexpected errors centrally

---

# Security

## Never

- Trust frontend validation alone
- Store secrets in frontend
- Expose sensitive information
- Bypass Angular sanitization

---

# Environment Configuration

## Rules

- Use environment files properly
- Never hardcode URLs
- Never hardcode secrets

---

# Naming Conventions

## Files

```txt
transaction-list.component.ts
auth.service.ts
dashboard.facade.ts
```

## Classes

```ts
TransactionService;
AuthGuard;
DashboardFacade;
```

## Observables

Suffix observables with `$`

GOOD:

```ts
user$;
transactions$;
```

---

# Forms

## Prefer

- Reactive forms
- Strong typing
- Reusable validators

Avoid template-driven forms for complex flows.

---

# Routing

## Rules

- Lazy load feature modules/routes
- Keep route configuration clean
- Use route guards responsibly

---

# Testing

## Minimum Expectations

- Unit test business logic
- Test critical flows
- Avoid brittle tests

Focus on:

- Services
- Facades
- State logic
- Critical UI interactions

---

# AI Agent Coding Behaviour

## Before Writing Code

The AI agent should:

1. Understand existing architecture
2. Reuse existing patterns
3. Avoid introducing unnecessary libraries
4. Check if functionality already exists
5. Keep consistency with current codebase

---

# AI Agent Refactoring Rules

When refactoring:

- Do not change behavior unless requested
- Improve readability first
- Reduce complexity
- Remove duplication
- Preserve backward compatibility where possible

---

# PR Standards

Generated code should:

- Compile successfully
- Pass linting
- Avoid unused imports
- Avoid console.logs
- Include proper typing
- Follow formatting conventions

---

# Architecture Preferences

Preferred architecture:

- Feature-based architecture
- Clean separation of concerns
- Thin components
- Service-driven business logic
- Reusable shared UI
- Scalable folder structure

---

# Avoid Overengineering

Do NOT:

- Create abstractions too early
- Introduce patterns without clear value
- Split tiny logic into many files unnecessarily
- Add state management libraries prematurely

---

# Preferred Stack

Preferred:

- Angular
- RxJS
- SCSS
- TypeScript strict mode
- Angular Signals
- Standalone Components

---

# Final Rule

Every code change should improve at least one of:

- Readability
- Maintainability
- Scalability
- Performance
- Developer experience

Without making the project unnecessarily complex.
