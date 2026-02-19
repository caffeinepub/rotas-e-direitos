/**
 * PagBank payment error message sanitizer
 * Maps backend PagBank errors to user-friendly Portuguese messages
 */

export interface PagBankErrorResult {
  message: string;
  isUserError: boolean;
  requiresAdminAction: boolean;
}

/**
 * Sanitize PagBank error and return user-friendly Portuguese message
 */
export function sanitizePagBankError(error: any): PagBankErrorResult {
  const errorMessage = error?.message || error?.toString() || '';
  const lowerMessage = errorMessage.toLowerCase();

  // PagBank provider not enabled
  if (lowerMessage.includes('pagbank') && (lowerMessage.includes('not enabled') || lowerMessage.includes('provider not enabled'))) {
    return {
      message: 'PagBank não está habilitado. Entre em contato com o suporte.',
      isUserError: false,
      requiresAdminAction: true,
    };
  }

  // Missing configuration
  if (lowerMessage.includes('clientid') || lowerMessage.includes('clientsecret') || lowerMessage.includes('merchantid') || lowerMessage.includes('webhooksecret')) {
    return {
      message: 'Configuração do PagBank incompleta. Entre em contato com o suporte.',
      isUserError: false,
      requiresAdminAction: true,
    };
  }

  // Invalid credentials / authentication
  if (lowerMessage.includes('invalid credentials') || lowerMessage.includes('authentication failed') || lowerMessage.includes('unauthorized')) {
    return {
      message: 'Erro de autenticação no PagBank. Entre em contato com o suporte.',
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

  // Webhook signature validation
  if (lowerMessage.includes('signature') || lowerMessage.includes('webhook')) {
    return {
      message: 'Erro na validação do webhook. Entre em contato com o suporte.',
      isUserError: false,
      requiresAdminAction: true,
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
