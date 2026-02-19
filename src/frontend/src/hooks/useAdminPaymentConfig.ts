import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { PaymentConfig } from '../backend';

/**
 * Note: The backend does not expose a getPaymentConfig query method for security reasons.
 * Use usePublicPaymentConfig to fetch non-sensitive configuration fields.
 */

/**
 * Update payment configuration (admin only)
 */
export function useUpdatePaymentConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, PaymentConfig>({
    mutationFn: async (newConfig: PaymentConfig) => {
      if (!actor) throw new Error('Actor not available');
      
      if (typeof actor.setPaymentConfig !== 'function') {
        throw new Error('Update payment configuration method not available');
      }
      
      try {
        await actor.setPaymentConfig(newConfig);
      } catch (error: any) {
        // Sanitize error to avoid exposing sensitive backend data
        console.error('Payment config update error (sanitized):', error.message);
        
        // Re-throw with safe message
        if (error.message?.includes('required') || error.message?.includes('fields') || error.message?.includes('clientId') || error.message?.includes('clientSecret') || error.message?.includes('merchantId') || error.message?.includes('webhookSecret')) {
          throw new Error('Configuration validation failed. Please verify all required fields.');
        } else if (error.message?.includes('trap') || error.message?.includes('Unauthorized')) {
          throw new Error('Backend validation failed. Please check your permissions.');
        } else {
          throw new Error('Configuration update failed. Please try again.');
        }
      }
    },
    onSuccess: () => {
      // Invalidate public payment config to refresh UI with saved state
      queryClient.invalidateQueries({ queryKey: ['publicPaymentConfig'] });
    },
  });
}
