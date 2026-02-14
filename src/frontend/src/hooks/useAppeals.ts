import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Appeal, ReasonCategory } from '../types/backend-extended';
import { Platform } from '../backend';

interface GenerateAppealParams {
  platform: Platform;
  reasonCategory: ReasonCategory;
  userExplanation: string;
  evidenceIds: number[];
}

export function useGenerateAppeal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<Appeal, Error, GenerateAppealParams>({
    mutationFn: async (params: GenerateAppealParams) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      throw new Error('Generate appeal functionality not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appeals'] });
    },
  });
}

export function useGetAppeal(appealId: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Appeal | null>({
    queryKey: ['appeal', appealId],
    queryFn: async () => {
      if (!actor) return null;
      // Backend method not implemented yet
      return null;
    },
    enabled: !!actor && !isFetching && appealId > 0,
  });
}

export function useGetCallerAppeals() {
  const { actor, isFetching } = useActor();

  return useQuery<Appeal[]>({
    queryKey: ['appeals'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not implemented yet
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}
