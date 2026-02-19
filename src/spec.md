# Specification

## Summary
**Goal:** Integrate PagBank payment gateway as an alternative payment provider alongside the existing gateway, allowing administrators to configure and use PagBank for subscription payments.

**Planned changes:**
- Add PagBank as a selectable payment provider option in admin payment settings with API credential configuration fields
- Implement backend payment session creation endpoint for PagBank that generates checkout URLs and tracks payment sessions
- Create frontend payment flow hook (usePagBankPayment) for initiating payments, redirecting to PagBank checkout, and polling payment status
- Add backend webhook handler to receive PagBank payment notifications and activate subscriptions on approved payments
- Update CheckoutPage to detect active payment provider and render PagBank-specific flow when selected
- Create PagBankSetupGuide component with step-by-step instructions for administrators to configure PagBank integration

**User-visible outcome:** Administrators can configure PagBank as the payment provider and users can complete subscription payments through PagBank checkout, with automatic subscription activation upon successful payment.
