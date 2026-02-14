import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { LossProfile } from '../backend';
import { PublicLossProfile } from '../types/backend-extended';

export function useGetCallerLossProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<LossProfile | null>({
    queryKey: ['lossProfile'],
    queryFn: async () => {
      if (!actor) return null;
      // Backend method not implemented yet
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetLossProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, LossProfile>({
    mutationFn: async (profile: LossProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setLossProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lossProfile'] });
    },
  });
}
