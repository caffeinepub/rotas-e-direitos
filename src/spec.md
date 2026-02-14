# Specification

## Summary
**Goal:** Add a reusable, responsive marketing banner to the public landing experience that highlights the app’s services and benefits for gig drivers (Uber, 99, iFood, InDriver).

**Planned changes:**
- Create a reusable React marketing banner component with responsive layout (stacked on small screens, multi-column on larger screens).
- Include platform mentions (Uber, 99, iFood, InDriver, optionally “and others”) via text and/or badges/chips/icons within the banner.
- Highlight at least 3 existing app benefits/services (e.g., evidence tracking, loss calculation, appeal generation, collective insights, privacy/security) without introducing new features.
- Add static banner image assets under `frontend/public/assets/generated` and reference them from the banner component.
- Integrate the banner near the top of `frontend/src/pages/PublicOverviewPage.tsx` while keeping existing CTAs and overall structure intact and consistent with the current theme.

**User-visible outcome:** Unauthenticated users see a prominent, responsive banner near the top of the public overview page that clearly communicates supported gig platforms and key app benefits, with correctly loading static images.
