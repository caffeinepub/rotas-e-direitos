import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { LossProfile, PublicLossProfile } from '../backend';

export function useGetCallerLossProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PublicLossProfile | null>({
    queryKey: ['lossProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerLossProfile();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSetLossProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: LossProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setLossProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lossProfile'] });
    },
  });
}
