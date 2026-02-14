import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useGetRevisoMotivadaMessage() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['revisoMotivadaMessage'],
    queryFn: async () => {
      if (!actor) return '';
      // Backend method not implemented yet
      return 'Reviso motivada message not available';
    },
    enabled: !!actor && !isFetching,
  });
}
