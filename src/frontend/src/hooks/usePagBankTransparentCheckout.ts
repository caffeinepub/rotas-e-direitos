import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { PagBankTransparentCheckoutConfig } from '../backend';

export function useGetPagBankTransparentCheckoutConfig() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PagBankTransparentCheckoutConfig | null>({
    queryKey: ['pagbankTransparentCheckoutConfig'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPagBankTransparentCheckoutConfig();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useSetPagBankTransparentCheckoutConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: PagBankTransparentCheckoutConfig) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setPagBankTransparentCheckoutConfig(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagbankTransparentCheckoutConfig'] });
    },
  });
}
