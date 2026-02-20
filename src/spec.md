# Specification

## Summary
**Goal:** Fix the PIX QR code display bug in the checkout flow so it appears correctly when users select PIX payment.

**Planned changes:**
- Debug and fix PIX QR code generation and display logic in checkout
- Verify PixQrCodeDisplay component receives and displays PIX email key correctly
- Check CheckoutPage integration with Gateway and PagBank payment providers to ensure QR code triggers properly

**User-visible outcome:** Users can see the PIX QR code and copy the payment information when selecting PIX as their payment method during checkout.
