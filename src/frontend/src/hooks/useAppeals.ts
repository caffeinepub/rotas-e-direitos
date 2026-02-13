import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Appeal, Platform, ReasonCategory } from '../backend';

export function useGenerateAppeal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      platform: Platform;
      reasonCategory: ReasonCategory;
      userExplanation: string;
      evidenceIds: bigint[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateAppeal(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appeals'] });
    },
  });
}

export function useGetAppeal(appealId: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Appeal | null>({
    queryKey: ['appeal', appealId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAppeal(BigInt(appealId));
    },
    enabled: !!actor && !actorFetching && appealId > 0,
  });
}

export function useGetCallerAppeals() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Appeal[]>({
    queryKey: ['appeals'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerAppeals();
    },
    enabled: !!actor && !actorFetching,
  });
}
