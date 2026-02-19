/**
 * Payment provider configuration layer
 * Manages provider identifiers and local storage for selected provider UI state
 * Does not store secrets - only provider selection preferences
 */

import { PublicPaymentConfig } from '../../backend';

export type PaymentProvider = 'gateway' | 'pagbank';

export const availableProviders: PaymentProvider[] = ['gateway', 'pagbank'];

const STORAGE_KEY = 'selected_payment_provider';

/**
 * Get the currently selected payment provider from localStorage
 */
export function getSelectedProvider(): PaymentProvider | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && availableProviders.includes(stored as PaymentProvider)) {
      return stored as PaymentProvider;
    }
  } catch (error) {
    console.error('Failed to read selected provider from localStorage:', error);
  }
  return null;
}

/**
 * Set the selected payment provider in localStorage
 */
export function setSelectedProvider(provider: PaymentProvider): void {
  try {
    if (!availableProviders.includes(provider)) {
      console.warn(`Invalid provider: ${provider}`);
      return;
    }
    localStorage.setItem(STORAGE_KEY, provider);
  } catch (error) {
    console.error('Failed to save selected provider to localStorage:', error);
  }
}

/**
 * Clear the selected payment provider from localStorage
 */
export function clearSelectedProvider(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear selected provider from localStorage:', error);
  }
}

/**
 * Determine the active payment provider from public config
 * Priority: PagBank > Gateway
 */
export function getActiveProvider(config: PublicPaymentConfig | undefined): PaymentProvider | null {
  if (!config) return null;
  
  // If PagBank is enabled, prioritize it
  if (config.pagbankProvider.enabled) {
    return 'pagbank';
  }
  
  // Otherwise use gateway if enabled
  if (config.gatewayProvider.enabled) {
    return 'gateway';
  }
  
  return null;
}
