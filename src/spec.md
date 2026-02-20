# Specification

## Summary
**Goal:** Fix the PIX QR code display issue in the checkout flow so users can complete PIX payments.

**Planned changes:**
- Debug and fix the PIX QR code rendering in the checkout page
- Verify PixQrCodeDisplay component integration and data flow from PagBank
- Ensure PIX payload generation creates valid BR Code format with correct CRC16 checksum
- Test QR code scannability and copy-to-clipboard functionality
- Validate display on both desktop and mobile viewports

**User-visible outcome:** Users selecting PIX as payment method will see a scannable QR code and be able to copy the PIX key/payload to complete their purchase.
