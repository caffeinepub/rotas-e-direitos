import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { WorkSession, WeatherCondition } from '../backend';

export function useLogWorkSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { city: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.logWorkSession(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workSessions'] });
    },
  });
}

export function useEndWorkSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: number) => {
      if (!actor) throw new Error('Actor not available');
      return actor.endWorkSession(BigInt(sessionId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workSessions'] });
    },
  });
}

export function useAddWeatherSample() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      sessionId: number;
      condition: WeatherCondition;
      temperatureC: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addWeatherSample(BigInt(params.sessionId), {
        condition: params.condition,
        temperatureC: params.temperatureC,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workSession', variables.sessionId] });
    },
  });
}

export function useGetWorkSession(sessionId: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WorkSession | null>({
    queryKey: ['workSession', sessionId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getWorkSession(BigInt(sessionId));
    },
    enabled: !!actor && !actorFetching && sessionId > 0,
  });
}

export function useGetAllWorkSessions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WorkSession[]>({
    queryKey: ['workSessions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const allEvidence = await actor.getAllEvidence();
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}
