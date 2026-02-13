# Specification

## Summary
**Goal:** Build the MVP web app “ROTAS E DIREITOS” on Internet Computer with four modules (Evidence Tracker, Loss Calculator, Appeal Generator, Collective Data), Internet Identity auth, offline-first evidence handling, and Portuguese-only dark-first UI.

**Planned changes:**
- Create home dashboard with navigation to four module landing pages and first-time empty-state guidance.
- Add Internet Identity sign-in/sign-out and scope all personal data to the authenticated principal; allow signed-out users to view only a read-only overview/aggregates.
- Evidence Tracker: upload two image evidence types (daily selfie, platform print), capture metadata (type, timestamp, notes/tags, optional platform), show timeline with filters and per-item detail view.
- Evidence storage: persist metadata in a single Motoko backend actor; store images in browser IndexedDB for offline access; export selected items as a client-side ZIP with images + manifest JSON.
- Work Session logging: start/end session controls; choose city/region; periodically record weather samples linked to the active session; list sessions and show session detail with weather timeline/table.
- Loss Calculator: profile form (daily earnings BRL, days/week, deactivation date) persisted per user; compute weekly/monthly/accumulated loss; show results cards and a 30/60/90-day projection bar chart.
- Loss PDF: generate downloadable PDF including title, anonymous short identifier, period, values table, and embedded projection chart; provide Download and Share (share sheet fallback to download).
- Appeal Generator: step-by-step form (platform, reason category, free-text explanation, evidence selection); generate template-based appeal text (varies by platform + reason), allow editing, export as .txt.
- Appeal sending: “Send via Email” using mailto: with platform-specific recipient/subject and the edited appeal text in body; show instructions to manually attach ZIP/PDF.
- Collective Data: after appeal generation, prompt opt-in anonymous report submission (platform, city/region, predefined neighborhood, reason, date) with “Not now” and “Don’t ask again”; store anonymous records in backend and expose aggregated stats.
- Collective Insights page (no maps): charts/tables for counts by platform/reason and trends (last 30/90 days) with filters (platform, reason, period, city/region).
- Apply a coherent, accessible dark-first theme with large touch-friendly controls, consistent styling, Portuguese-only in-app content, and a non-blue/purple primary palette.

**User-visible outcome:** Users can sign in with Internet Identity to upload and manage evidence (offline-capable), log work sessions with weather samples, calculate and export loss reports (PDF), generate/edit/export appeal texts and open a prefilled email draft, and optionally submit anonymous deactivation reports that appear as public aggregated insights.
