# Specification

## Summary
**Goal:** Update the main page (route `/`) typography to use a more modern, readable sans-serif font across the UI in both light and dark mode.

**Planned changes:**
- Add/load a modern sans-serif font (via `frontend/index.html` and/or CSS) and configure Tailwind to use it (e.g., update `fontFamily.sans` in `frontend/tailwind.config.js`).
- Apply the new font globally in base styles (e.g., `frontend/src/index.css`) so the main page (`frontend/src/pages/PublicOverviewPage.tsx`) uses it without per-component overrides.
- Verify key main page text (including the H1 “ROTAS E DIREITOS” and supporting paragraph) renders with the updated font, without modifying immutable frontend paths or backend code.

**User-visible outcome:** The homepage displays all headings, body text, buttons, and navigation in a more modern sans-serif font with good readability in light and dark mode.
