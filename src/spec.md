# Specification

## Summary
**Goal:** Add a third homepage color style variant (Style C) for the unauthenticated landing page, with distinct light and dark palettes, without changing existing Style A or Style B behavior.

**Planned changes:**
- Extend the homepage style variant system from `'A' | 'B'` to include a third option (e.g., `'C'`) and keep persistence via the existing `localStorage` key `homepage-style-variant`.
- Update `PublicOverviewPage` to apply a new CSS scope class for Style C (e.g., `.home-style-c`) and ensure the style toggle cycles A → B → C (and back) while reflecting the current selection.
- Update `MarketingBanner` to accept the new variant value and apply appropriate styling so text/badges/controls remain readable in both light and dark mode.
- Define Style C theme overrides in `frontend/src/index.css` using CSS variables under new scope selectors for light and dark (e.g., `.home-style-c` and `.dark .home-style-c`) without affecting other pages/variants.

**User-visible outcome:** Users on the public homepage can switch between Style A, Style B, and the new Style C; their choice persists across refreshes, and the landing page + marketing banner remain readable in both light and dark mode.
