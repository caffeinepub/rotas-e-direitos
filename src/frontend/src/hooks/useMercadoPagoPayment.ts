import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { SubscriptionPlan, PaymentStatus as BackendPaymentStatus } from '../backend';
import { MercadoPagoPaymentResponse, PaymentStatus } from '../types/mercadopago';
import { sanitizePaymentError } from '../lib/payments/paymentErrorMessages';

export function useCreateMercadoPagoPayment() {
  const { actor } = useActor();

  return useMutation<MercadoPagoPaymentResponse, string, SubscriptionPlan>({
    mutationFn: async (plan: SubscriptionPlan) => {
      if (!actor) throw new Error('Actor not available');

      try {
        const backendResponse = await actor.createPaymentPreference(plan);

        // Transform backend response to frontend type
        const response: MercadoPagoPaymentResponse = {
          checkoutUrl: backendResponse.checkoutUrl || undefined,
          paymentId: backendResponse.paymentId,
          pixInstructions: undefined, // Backend doesn't provide this yet
        };

        return response;
      } catch (error: any) {
        const sanitized = sanitizePaymentError(error);
        throw sanitized.userMessage;
      }
    },
  });
}

/**
 * Parse backend payment status response and extract status
 */
function parsePaymentStatus(backendStatus: BackendPaymentStatus): PaymentStatus {
  try {
    // Backend returns status as a string in the status field
    const statusStr = backendStatus.status.toLowerCase();
    
    // Handle special cases
    if (statusStr === 'free') return 'approved';
    
    // Map backend status strings to frontend PaymentStatus
    if (statusStr.includes('approved') || statusStr.includes('accredited')) return 'approved';
    if (statusStr.includes('rejected') || statusStr.includes('cancelled')) return 'rejected';
    if (statusStr.includes('pending') || statusStr.includes('in_process')) return 'pending';
    if (statusStr.includes('error')) return 'error';
    
    // Try to parse rawResponse for more details
    if (backendStatus.rawResponse && backendStatus.rawResponse !== 'null') {
      try {
        const parsed = JSON.parse(backendStatus.rawResponse);
        if (parsed.results && parsed.results.length > 0) {
          const firstResult = parsed.results[0];
          const resultStatus = firstResult.status?.toLowerCase() || '';
          
          if (resultStatus === 'approved' || resultStatus === 'accredited') return 'approved';
          if (resultStatus === 'rejected' || resultStatus === 'cancelled') return 'rejected';
          if (resultStatus === 'pending' || resultStatus === 'in_process') return 'pending';
        }
      } catch {
        // If parsing fails, continue with default
      }
    }
    
    // Default to pending if we can't determine
    return 'pending';
  } catch {
    return 'error';
  }
}

export function useCheckPaymentStatus(paymentId: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PaymentStatus>({
    queryKey: ['paymentStatus', paymentId],
    queryFn: async (): Promise<PaymentStatus> => {
      if (!actor || !paymentId) {
        return 'pending';
      }

      try {
        const backendStatus = await actor.checkPaymentStatus(paymentId);
        return parsePaymentStatus(backendStatus);
      } catch (error: any) {
        console.error('Payment status check error:', error.message);
        const sanitized = sanitizePaymentError(error);
        
        // If unauthorized or not found, return error status
        if (sanitized.type === 'unauthorized') {
          return 'error';
        }
        
        // For other errors, return pending to allow retry
        return 'pending';
      }
    },
    enabled: !!actor && !actorFetching && !!paymentId,
    refetchInterval: (query) => {
      // Stop polling if payment is no longer pending
      const data = query.state.data;
      if (data && data !== 'pending' && data !== 'in_process') {
        return false;
      }
      return 5000; // Poll every 5 seconds while pending
    },
    retry: 3,
  });
}

export function useConfirmPaymentAndUpgrade() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, string, { paymentId: string; status: PaymentStatus }>({
    mutationFn: async ({ paymentId, status }) => {
      if (!actor) throw new Error('Actor not available');

      // Only proceed if payment is approved
      if (status !== 'approved') {
        throw new Error('Payment must be approved before confirming subscription upgrade');
      }

      try {
        // Verify payment status one more time before confirming
        const backendStatus = await actor.checkPaymentStatus(paymentId);
        const verifiedStatus = parsePaymentStatus(backendStatus);
        
        if (verifiedStatus !== 'approved') {
          throw new Error('Payment verification failed. Status is not approved.');
        }

        // Payment is verified as approved
        // The backend should handle subscription upgrade based on the payment record
        // For now, we just verify the status and let the subscription system handle it
        
        // Invalidate subscription status to refresh
        queryClient.invalidateQueries({ queryKey: ['subscriptionStatus'] });
        
      } catch (error: any) {
        const sanitized = sanitizePaymentError(error);
        throw sanitized.userMessage;
      }
    },
  });
}
