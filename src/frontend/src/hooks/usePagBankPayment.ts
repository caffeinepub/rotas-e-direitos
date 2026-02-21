import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { SubscriptionPlan, PaymentCheckoutResponse, PaymentStatus } from '../types/backend-extended';
import { useState } from 'react';

export type PaymentFlowState = 'idle' | 'initiating' | 'pending' | 'completed' | 'failed';

export interface PaymentFlowStatus {
  state: PaymentFlowState;
  paymentId: string | null;
  error: string | null;
}

/**
 * Custom hook to manage PagBank payment flow state and interactions
 */
export function usePagBankPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  
  const [flowStatus, setFlowStatus] = useState<PaymentFlowStatus>({
    state: 'idle',
    paymentId: null,
    error: null,
  });

  // Mutation to create a PagBank payment session
  const createSessionMutation = useMutation<PaymentCheckoutResponse, Error, SubscriptionPlan>({
    mutationFn: async (plan: SubscriptionPlan) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented
      throw new Error('PagBank payment not yet implemented in backend');
    },
    onMutate: () => {
      setFlowStatus({
        state: 'initiating',
        paymentId: null,
        error: null,
      });
    },
    onSuccess: (response) => {
      setFlowStatus({
        state: 'pending',
        paymentId: response.paymentId,
        error: null,
      });

      // If checkout URL is provided, redirect user to PagBank
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      }
    },
    onError: (error) => {
      setFlowStatus({
        state: 'failed',
        paymentId: null,
        error: error.message,
      });
    },
  });

  // Mutation to check payment status
  const checkStatusMutation = useMutation<PaymentStatus, Error, string>({
    mutationFn: async (paymentId: string) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented
      throw new Error('Payment status check not yet implemented in backend');
    },
    onSuccess: (status) => {
      if (status.status === 'approved' || status.status === 'completed') {
        setFlowStatus({
          state: 'completed',
          paymentId: status.paymentId,
          error: null,
        });
        // Invalidate subscription status to refresh user's plan
        queryClient.invalidateQueries({ queryKey: ['subscriptionStatus'] });
      } else if (status.status === 'rejected' || status.status === 'cancelled' || status.status === 'failed') {
        setFlowStatus({
          state: 'failed',
          paymentId: status.paymentId,
          error: 'Payment was not approved',
        });
      } else {
        // Still pending
        setFlowStatus(prev => ({
          ...prev,
          state: 'pending',
        }));
      }
    },
    onError: (error) => {
      setFlowStatus(prev => ({
        ...prev,
        state: 'failed',
        error: error.message,
      }));
    },
  });

  const startPayment = async (plan: SubscriptionPlan) => {
    await createSessionMutation.mutateAsync(plan);
  };

  const checkStatus = async (paymentId: string) => {
    await checkStatusMutation.mutateAsync(paymentId);
  };

  const reset = () => {
    setFlowStatus({
      state: 'idle',
      paymentId: null,
      error: null,
    });
  };

  return {
    flowStatus,
    startPayment,
    checkStatus,
    reset,
    isInitiating: createSessionMutation.isPending,
    isCheckingStatus: checkStatusMutation.isPending,
  };
}
