/**
 * Gateway payment error message sanitizer
 * Maps backend gateway errors to user-friendly Portuguese messages
 */

export interface GatewayErrorResult {
  message: string;
  isUserError: boolean;
  requiresAdminAction: boolean;
}

/**
 * Sanitize gateway error and return user-friendly Portuguese message
 */
export function sanitizeGatewayError(error: any): GatewayErrorResult {
  const errorMessage = error?.message || error?.toString() || '';
  const lowerMessage = errorMessage.toLowerCase();

  // Payment provider not enabled
  if (lowerMessage.includes('not enabled') || lowerMessage.includes('provider not enabled')) {
    return {
      message: 'Gateway de pagamento não está habilitado. Entre em contato com o suporte.',
      isUserError: false,
      requiresAdminAction: true,
    };
  }

  // Invalid credentials / configuration
  if (lowerMessage.includes('invalid credentials') || lowerMessage.includes('authentication failed') || lowerMessage.includes('api key')) {
    return {
      message: 'Erro de autenticação no gateway. Entre em contato com o suporte.',
      isUserError: false,
      requiresAdminAction: true,
    };
  }

  // Payment declined
  if (lowerMessage.includes('declined') || lowerMessage.includes('recusado') || lowerMessage.includes('rejected')) {
    return {
      message: 'Pagamento recusado. Tente outro método de pagamento.',
      isUserError: true,
      requiresAdminAction: false,
    };
  }

  // Insufficient funds
  if (lowerMessage.includes('insufficient funds') || lowerMessage.includes('saldo insuficiente')) {
    return {
      message: 'Saldo insuficiente. Verifique sua conta e tente novamente.',
      isUserError: true,
      requiresAdminAction: false,
    };
  }

  // Timeout
  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return {
      message: 'Tempo esgotado. Tente novamente em alguns instantes.',
      isUserError: false,
      requiresAdminAction: false,
    };
  }

  // Network errors
  if (lowerMessage.includes('network') || lowerMessage.includes('connection') || lowerMessage.includes('unreachable')) {
    return {
      message: 'Erro de conexão. Verifique sua internet e tente novamente.',
      isUserError: false,
      requiresAdminAction: false,
    };
  }

  // Validation failures
  if (lowerMessage.includes('validation') || lowerMessage.includes('invalid') || lowerMessage.includes('required')) {
    return {
      message: 'Dados inválidos. Verifique as informações e tente novamente.',
      isUserError: true,
      requiresAdminAction: false,
    };
  }

  // Unauthorized
  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('permission')) {
    return {
      message: 'Você não tem permissão para realizar esta ação.',
      isUserError: true,
      requiresAdminAction: false,
    };
  }

  // Generic payment failure
  if (lowerMessage.includes('payment') && lowerMessage.includes('failed')) {
    return {
      message: 'Falha no processamento do pagamento. Tente novamente.',
      isUserError: false,
      requiresAdminAction: false,
    };
  }

  // Unknown error
  return {
    message: 'Erro inesperado. Entre em contato com o suporte se o problema persistir.',
    isUserError: false,
    requiresAdminAction: false,
  };
}
