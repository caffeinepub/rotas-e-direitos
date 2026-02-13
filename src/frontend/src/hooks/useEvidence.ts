import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Evidence, EvidenceType, Platform } from '../backend';

export function useCreateEvidence() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      evidenceType: EvidenceType;
      notes: string;
      platform?: Platform;
      regiao?: any;
      bairro?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createEvidence(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
      queryClient.invalidateQueries({ queryKey: ['timeline'] });
    },
  });
}

export function useGetEvidenceById(evidenceId: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Evidence | null>({
    queryKey: ['evidence', evidenceId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getEvidenceById(BigInt(evidenceId));
    },
    enabled: !!actor && !actorFetching && evidenceId > 0,
  });
}

export function useGetAllEvidence() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Evidence[]>({
    queryKey: ['evidence'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllEvidence();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTimeline(params: {
  typeFilter?: EvidenceType | null;
  platformFilter?: Platform | null;
}) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Evidence[]>({
    queryKey: ['timeline', params.typeFilter, params.platformFilter],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTimeline({
        typeFilter: params.typeFilter || undefined,
        platformFilter: params.platformFilter || undefined,
      });
    },
    enabled: !!actor && !actorFetching,
  });
}
