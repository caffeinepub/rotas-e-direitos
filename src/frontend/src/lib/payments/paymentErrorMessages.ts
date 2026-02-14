/**
 * Centralized payment error message sanitizer
 * Maps backend payment errors to safe, consistent English user-facing messages
 */

export type PaymentErrorType = 
  | 'provider_disabled'
  | 'provider_not_configured'
  | 'payment_failed'
  | 'payment_not_approved'
  | 'unauthorized'
  | 'missing_config'
  | 'unknown';

export interface SafePaymentError {
  type: PaymentErrorType;
  userMessage: string;
  showAdminAction: boolean;
}

/**
 * Sanitize and map backend error to safe user-facing message
 */
export function sanitizePaymentError(error: any): SafePaymentError {
  const errorMessage = error?.message || error?.toString() || '';
  const lowerMessage = errorMessage.toLowerCase();

  // Provider not enabled/configured
  if (lowerMessage.includes('not enabled') || lowerMessage.includes('provider not enabled')) {
    return {
      type: 'provider_disabled',
      userMessage: 'Payment provider is not enabled. Please contact an administrator to configure the payment system.',
      showAdminAction: true,
    };
  }

  // Missing backend configuration
  if (lowerMessage.includes('missing backend configuration') || lowerMessage.includes('cannot process payment')) {
    return {
      type: 'missing_config',
      userMessage: 'Payment system is not fully configured. Please contact an administrator to complete the setup.',
      showAdminAction: true,
    };
  }

  // Provider not configured (missing credentials)
  if (lowerMessage.includes('not configured') || lowerMessage.includes('ainda naofoi configurado')) {
    return {
      type: 'provider_not_configured',
      userMessage: 'Payment provider has not been configured yet. An administrator needs to set up the payment credentials before payments can be processed.',
      showAdminAction: true,
    };
  }

  // Payment not approved
  if (lowerMessage.includes('not approved') || lowerMessage.includes('not yet approved') || lowerMessage.includes('verification failed')) {
    return {
      type: 'payment_not_approved',
      userMessage: 'Payment has not been approved yet. Please wait for confirmation or try again.',
      showAdminAction: false,
    };
  }

  // Unauthorized
  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('permission') || lowerMessage.includes('not found')) {
    return {
      type: 'unauthorized',
      userMessage: 'You do not have permission to perform this action.',
      showAdminAction: false,
    };
  }

  // Payment failed
  if (lowerMessage.includes('failed') || lowerMessage.includes('error') || lowerMessage.includes('internal error')) {
    return {
      type: 'payment_failed',
      userMessage: 'Payment processing failed. Please try again or contact support if the problem persists.',
      showAdminAction: false,
    };
  }

  // Unknown error
  return {
    type: 'unknown',
    userMessage: 'An unexpected error occurred. Please try again or contact support.',
    showAdminAction: false,
  };
}

/**
 * Get user-friendly message for payment provider not configured state
 */
export function getProviderNotConfiguredMessage(providerName: string, isAdmin: boolean): string {
  if (isAdmin) {
    return `${providerName} has not been configured. Please go to the Admin Dashboard to set up payment credentials.`;
  }
  return `${providerName} is not available yet. Please contact an administrator to enable payment processing.`;
}
