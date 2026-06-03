---
applyTo: 'src/**/*.ts,src/**/*.html,src/**/*.css'
---

# Paint Application Rules

- Preserve a smooth drawing experience: avoid changes that introduce visible lag, flicker, or broken pointer capture during drawing.
- Treat the canvas bitmap as the source of truth for rendered artwork.
- Keep UI components thin; move drawing engine, history, and tool-state logic into services.
- Use unified pointer-event handling for drawing interactions so mouse and touch behavior stay consistent.
- Keep tool state centralized so the active tool, color, and brush size are shared consistently across the UI.
- Undo and redo must restore complete canvas state correctly without mutating previous history entries.
- Erasing should remove drawn content naturally when feasible rather than depending on a white background.
- Export and import behavior must preserve image dimensions and transparency when supported by the canvas data.
- Keep the layout responsive and ensure canvas resizing does not distort the drawing surface.
- Prefer changes that keep brush, eraser, shapes, clear, export, and import behavior predictable and easy to test.
