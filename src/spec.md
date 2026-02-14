# Specification

## Summary
**Goal:** Fix Mercado Pago integration so checkout reliably creates a payment, returns a valid checkout URL, supports status checks and confirmation, and upgrades subscriptions without placeholder/not-implemented errors.

**Planned changes:**
- Backend: Implement Mercado Pago preference creation via HTTP outcall, returning a valid checkout URL tied to the caller and selected plan via a stable external reference.
- Backend: Add APIs to fetch Mercado Pago payment status and to confirm an approved payment (verified against Mercado Pago) and upgrade the caller’s subscription.
- Backend: Persist Mercado Pago configuration across canister upgrades; improve validation so enabling Mercado Pago requires both Access Token and Public Key with clear, non-sensitive trap messages; keep access token private.
- Frontend: Update Mercado Pago hooks to use the real backend APIs for create/status/confirm, sanitize errors to safe English messages, and remove placeholder logic.
- Frontend: Update Checkout page to support returning from Mercado Pago (resume by reading an identifier from the URL) and show/poll real payment status.
- Frontend: Fix admin Mercado Pago configuration UI validation to accept supported key formats, save reliably, re-fetch and display updated enabled/publicKey state, and show English non-sensitive errors on failure.

**User-visible outcome:** Users can complete a Mercado Pago checkout end-to-end (create payment, be redirected, return, see real status, and get subscription upgraded on approval), and admins can enable/configure Mercado Pago reliably with safe validation and error messaging.
