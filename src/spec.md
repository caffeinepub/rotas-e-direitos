# Specification

## Summary
**Goal:** Implement a new payment gateway integration for subscription payments.

**Planned changes:**
- Add backend methods for creating payment sessions and querying payment status
- Implement webhook handler to process payment confirmations from the gateway
- Update checkout page to display payment options and initiate payment flow
- Create custom React hook to manage payment state and flow
- Add payment status tracking component with pending/success/error states
- Update admin dashboard to configure gateway settings (API credentials, webhook URL)
- Add payment error handling utilities with Portuguese error messages

**User-visible outcome:** Users can complete subscription payments through the new gateway on the checkout page, see real-time payment status, and admins can configure gateway settings from the dashboard.
