import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserAccessInfo } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

export function useGetAllUserAccessInfo() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserAccessInfo[]>({
    queryKey: ['allUserAccessInfo'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllUserAccessInfo();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useBlockUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.blockUser(targetPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUserAccessInfo'] });
    },
  });
}

export function useUnblockUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unblockUser(targetPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUserAccessInfo'] });
    },
  });
}
