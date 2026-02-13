import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useGetRevisoMotivadaMessage() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string>({
    queryKey: ['revisoMotivadaMessage'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getRevisoMotivadaMessage();
    },
    enabled: !!actor && !actorFetching,
  });
}
