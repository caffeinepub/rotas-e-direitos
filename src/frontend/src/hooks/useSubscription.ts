import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { SubscriptionStatus, SubscriptionPlan } from '../backend';
import { evaluateEntitlement, EntitlementStatus } from '../lib/subscriptions/rules';

export function useGetSubscriptionStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SubscriptionStatus>({
    queryKey: ['subscriptionStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSubscriptionStatus();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useEntitlement(): EntitlementStatus | null {
  const { data: status } = useGetSubscriptionStatus();
  
  if (!status) return null;
  
  return evaluateEntitlement(status);
}

export function useUpgradeSubscription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPlan: SubscriptionPlan) => {
      if (!actor) throw new Error('Actor not available');
      return actor.upgradeSubscription(newPlan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptionStatus'] });
    },
  });
}
