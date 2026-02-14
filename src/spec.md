# Specification

## Summary
**Goal:** Add an admin-only dashboard to track user subscription/access status and allow admins to block or unblock users from protected app features.

**Planned changes:**
- Add admin-only backend APIs to list user summaries (principal, optional profile info, subscription details, and blocked override flag).
- Add backend admin-only actions to block/unblock a user and a user-accessible query to read the caller’s own blocked status.
- Enforce the admin block override across protected backend update/write entrypoints so blocked users cannot use protected features.
- Create an Admin Dashboard page (admin-only) showing a searchable, mobile-friendly list of users and controls to block/unblock with confirmation.
- Add an Admin navigation entry that is visible only to admins and routes to the Admin Dashboard using the existing router setup.

**User-visible outcome:** Admins can open an Admin Dashboard to view users’ subscription/access status and block or unblock users; blocked users are prevented from using protected features even if they have an active subscription.
