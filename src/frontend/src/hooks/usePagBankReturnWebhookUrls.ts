import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { PagBankReturnWebhookUrlConfig } from '../backend';

export function useGetPagBankReturnWebhookUrls() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PagBankReturnWebhookUrlConfig | null>({
    queryKey: ['pagbankReturnWebhookUrls'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPagBankReturnWebhookUrls();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useSetPagBankReturnWebhookUrls() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: PagBankReturnWebhookUrlConfig) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setPagBankReturnWebhookUrls(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagbankReturnWebhookUrls'] });
    },
  });
}
