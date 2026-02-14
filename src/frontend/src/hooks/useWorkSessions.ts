import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { WorkSession, WeatherSample } from '../backend';

interface LogSessionParams {
  city: string;
}

export function useLogWorkSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<WorkSession, Error, LogSessionParams>({
    mutationFn: async (params: LogSessionParams) => {
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

  return useMutation<void, Error, number>({
    mutationFn: async (sessionId: number) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      throw new Error('End work session functionality not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workSessions'] });
    },
  });
}

interface AddWeatherSampleParams {
  sessionId: number;
  sample: WeatherSample;
}

export function useAddWeatherSample() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, AddWeatherSampleParams>({
    mutationFn: async (params: AddWeatherSampleParams) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      throw new Error('Add weather sample functionality not yet implemented in backend');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workSession', variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: ['workSessions'] });
    },
  });
}

export function useGetWorkSession(sessionId: number) {
  const { actor, isFetching } = useActor();

  return useQuery<WorkSession | null>({
    queryKey: ['workSession', sessionId],
    queryFn: async () => {
      if (!actor) return null;
      // Backend method not implemented yet
      return null;
    },
    enabled: !!actor && !isFetching && sessionId > 0,
  });
}

export function useGetAllWorkSessions() {
  const { actor, isFetching } = useActor();

  return useQuery<WorkSession[]>({
    queryKey: ['workSessions'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend doesn't have a getAll method, return empty for now
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}
