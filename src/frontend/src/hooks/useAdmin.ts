import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserAccessInfo } from '../types/backend-extended';
import { Principal } from '@dfinity/principal';

export function useGetAllUserAccessInfo() {
  const { actor, isFetching } = useActor();

  return useQuery<UserAccessInfo[]>({
    queryKey: ['allUserAccessInfo'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not implemented - return empty array
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBlockUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, Principal>({
    mutationFn: async (targetPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      throw new Error('Block user functionality not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUserAccessInfo'] });
    },
  });
}

export function useUnblockUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, Principal>({
    mutationFn: async (targetPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      throw new Error('Unblock user functionality not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUserAccessInfo'] });
    },
  });
}
