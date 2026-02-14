import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { CollectiveReport, ReasonCategory } from '../types/backend-extended';
import { Platform, Region } from '../backend';

interface SubmitReportParams {
  platform: Platform;
  region: Region;
  neighborhood: string;
  reason: ReasonCategory;
}

export function useSubmitCollectiveReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, SubmitReportParams>({
    mutationFn: async (params: SubmitReportParams) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      throw new Error('Submit collective report functionality not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectiveReports'] });
    },
  });
}

export function useGetCollectiveReports() {
  const { actor, isFetching } = useActor();

  return useQuery<CollectiveReport[]>({
    queryKey: ['collectiveReports'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not implemented yet
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}
