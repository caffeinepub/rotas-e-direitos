/**
 * Payment provider configuration layer.
 * This module manages provider identifiers and UI state derivation.
 * SECURITY: Never store or log API keys or secrets in frontend code.
 */

export type PaymentProvider = 'mercadoPago' | 'pagSeguro';

export interface ProviderInfo {
  id: PaymentProvider;
  name: string;
  displayName: string;
}

export const PAYMENT_PROVIDERS: ProviderInfo[] = [
  {
    id: 'mercadoPago',
    name: 'Mercado Pago',
    displayName: 'Mercado Pago',
  },
  {
    id: 'pagSeguro',
    name: 'PagSeguro',
    displayName: 'PagSeguro',
  },
];

/**
 * Get provider info by ID
 */
export function getProviderInfo(providerId: PaymentProvider): ProviderInfo | undefined {
  return PAYMENT_PROVIDERS.find((p) => p.id === providerId);
}

/**
 * Get selected provider from local storage (UI state only)
 */
export function getSelectedProvider(): PaymentProvider {
  try {
    const stored = localStorage.getItem('selectedPixProvider');
    if (stored === 'mercadoPago' || stored === 'pagSeguro') {
      return stored;
    }
  } catch {
    // Ignore storage errors
  }
  return 'mercadoPago'; // Default
}

/**
 * Save selected provider to local storage (UI state only)
 */
export function setSelectedProvider(provider: PaymentProvider): void {
  try {
    localStorage.setItem('selectedPixProvider', provider);
  } catch {
    // Ignore storage errors
  }
}
