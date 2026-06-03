# Global Project Rules

- Prefer clean, readable, production-style code.
- Avoid overengineering unless explicitly requested.
- Keep solutions simple and maintainable.
- Use strong typing where applicable.
- Do not introduce new dependencies without justification.
- Follow existing patterns in the repository.

# Instruction Loading

- Follow all repository instruction files under `.github/instructions/`, including review rules.
- When a task will modify files matched by a repository instruction file's `applyTo` pattern, read that instruction file before the first edit.
- Do not assume that selecting an agent automatically loads repository instruction files from disk.
- Do not wait for the user to explicitly ask you to inspect `.github` before loading applicable instruction files.
