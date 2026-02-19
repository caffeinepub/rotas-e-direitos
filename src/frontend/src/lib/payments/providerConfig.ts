/**
 * Payment provider configuration layer
 * Manages provider identifiers and local storage for selected provider UI state
 * Does not store secrets - only provider selection preferences
 */

export type PaymentProvider = 'gateway';

export const availableProviders: PaymentProvider[] = ['gateway'];

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
