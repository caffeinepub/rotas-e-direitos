/**
 * Mercado Pago payment types for frontend use
 * Aligned with backend PaymentCheckoutResponse and payment status structures
 */

export interface PixInstructions {
  qr_code_base64: string;
  qr_code: string;
  ticket_url: string;
}

export interface MercadoPagoPaymentResponse {
  paymentId: string;
  checkoutUrl?: string;
  pixInstructions?: PixInstructions;
}

export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'in_process' | 'error';

export interface PaymentStatusResponse {
  paymentId: string;
  status: PaymentStatus;
  statusDetail?: string;
}
