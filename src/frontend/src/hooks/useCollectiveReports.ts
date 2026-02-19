import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Platform, Region } from '../types/backend-extended';
import { CollectiveReport, ReasonCategory } from '../types/backend-extended';

export interface CollectiveReportSubmission {
  platform: Platform;
  region: Region;
  neighborhood: string;
  reason: ReasonCategory;
}

export function useSubmitCollectiveReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, CollectiveReportSubmission>({
    mutationFn: async (report: CollectiveReportSubmission) => {
      if (!actor) throw new Error('Actor not available');
      
      // Backend doesn't implement collective report submission
      throw new Error('Collective report submission not implemented');
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
      
      // Backend doesn't implement collective reports retrieval
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}
