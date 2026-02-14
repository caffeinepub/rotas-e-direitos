# Specification

## Summary
**Goal:** Refine the Style B (“home-style-b”) homepage color tone so the public homepage and MarketingBanner use a cohesive, balanced palette in both light and dark mode.

**Planned changes:**
- Update Style B CSS variable overrides in `frontend/src/index.css` (e.g., background, card, accent, border, ring) to improve tonal consistency across page surfaces.
- If needed, adjust Style B-only gradient/opacity choices in `frontend/src/components/marketing/MarketingBanner.tsx` so the banner matches surrounding surfaces and remains readable in light/dark mode.
- Ensure changes only affect Style B; keep Style A visually unchanged.

**User-visible outcome:** When Style B is selected on the public homepage, the page sections and MarketingBanner look consistently tinted with comfortable text contrast in both light and dark mode, without impacting Style A.
