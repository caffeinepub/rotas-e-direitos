import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { CollectiveReport, Platform, ReasonCategory, Region } from '../backend';

export function useSubmitCollectiveReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      platform: Platform;
      region: Region;
      neighborhood: string;
      reason: ReasonCategory;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitCollectiveReport(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectiveReports'] });
    },
  });
}

export function useGetCollectiveReports() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CollectiveReport[]>({
    queryKey: ['collectiveReports'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCollectiveReports();
    },
    enabled: !!actor && !actorFetching,
  });
}
