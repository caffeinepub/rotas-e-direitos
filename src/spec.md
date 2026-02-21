# Specification

## Summary
**Goal:** Fix the PIX QR code generation and display functionality on the checkout page.

**Planned changes:**
- Debug and resolve errors preventing QR code rendering in the PixQrCodeDisplay component
- Ensure valid PIX payload generation following BR Code specification with proper CRC16 checksum
- Verify PIX key and payment amount are correctly retrieved and passed to the QR code generator
- Add proper loading and error states for QR code generation
- Ensure copy-to-clipboard functionality works for both PIX key and payload

**User-visible outcome:** Users can select PIX as a payment method and see a valid QR code displayed on the checkout page, with the ability to copy the PIX key and payload to complete their payment.
