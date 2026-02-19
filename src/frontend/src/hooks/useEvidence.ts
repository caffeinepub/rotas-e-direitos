import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Evidence, EvidenceType, Platform, Region } from '../types/backend-extended';

export interface TimelineFilters {
  typeFilter: EvidenceType | 'all';
  platformFilter: Platform | 'all';
}

export interface EvidenceUploadParams {
  evidenceType: EvidenceType;
  notes: string;
  platform?: Platform;
  regiao?: Region;
  bairro?: string;
  duration?: bigint;
  audioQuality?: string;
  videoQuality?: string;
}

export function useGetAllEvidence() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Evidence[]>({
    queryKey: ['evidence'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Backend doesn't implement getAllEvidence, return empty array
      // Evidence is stored in IndexedDB on the client side
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUploadEvidence() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<bigint, Error, EvidenceUploadParams>({
    mutationFn: async (params: EvidenceUploadParams) => {
      if (!actor) throw new Error('Actor not available');
      
      // Backend doesn't implement evidence upload
      // Evidence is stored in IndexedDB on the client side
      throw new Error('Evidence upload not implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
    },
  });
}

export function useDeleteEvidence() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, bigint>({
    mutationFn: async (evidenceId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      
      // Backend doesn't implement evidence deletion
      // Evidence is stored in IndexedDB on the client side
      throw new Error('Evidence deletion not implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
    },
  });
}
