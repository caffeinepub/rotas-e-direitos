import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { PublicPaymentConfig } from '../backend';

/**
 * Fetch public payment provider configuration (non-sensitive fields only)
 */
export function usePublicPaymentConfig() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PublicPaymentConfig>({
    queryKey: ['publicPaymentConfig'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      if (typeof actor.getPublicPaymentConfig !== 'function') {
        throw new Error('Public payment configuration method not available');
      }
      
      return actor.getPublicPaymentConfig();
    },
    enabled: !!actor && !actorFetching,
    retry: 2,
    staleTime: 30000, // Cache for 30 seconds
  });
}
