import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Evidence, EvidenceType, Platform, Region } from '../backend';

interface CreateEvidenceParams {
  evidenceType: EvidenceType;
  notes: string;
  platform?: Platform;
  regiao?: Region;
  bairro?: string;
  duration?: number;
  audioQuality?: string;
  videoQuality?: string;
}

export function useCreateEvidence() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<Evidence, Error, CreateEvidenceParams>({
    mutationFn: async (params: CreateEvidenceParams) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      throw new Error('Create evidence functionality not yet implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
      queryClient.invalidateQueries({ queryKey: ['timeline'] });
    },
  });
}

export function useGetEvidenceById(evidenceId: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Evidence | null>({
    queryKey: ['evidence', evidenceId],
    queryFn: async () => {
      if (!actor) return null;
      // Backend method not implemented yet
      return null;
    },
    enabled: !!actor && !isFetching && evidenceId > 0,
  });
}

export function useGetAllEvidence() {
  const { actor, isFetching } = useActor();

  return useQuery<Evidence[]>({
    queryKey: ['evidence'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEvidence();
    },
    enabled: !!actor && !isFetching,
  });
}

interface TimelineFilters {
  startDate?: number;
  endDate?: number;
  evidenceType?: EvidenceType;
  platformFilter?: Platform | null;
  typeFilter?: EvidenceType | null;
}

export function useGetTimeline(filters?: TimelineFilters) {
  const { actor, isFetching } = useActor();

  return useQuery<Evidence[]>({
    queryKey: ['timeline', filters],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not implemented yet - fallback to getAllEvidence
      const allEvidence = await actor.getAllEvidence();
      
      // Apply client-side filtering if filters provided
      if (!filters) return allEvidence;
      
      return allEvidence.filter(evidence => {
        if (filters.startDate && evidence.uploadTime < BigInt(filters.startDate)) return false;
        if (filters.endDate && evidence.uploadTime > BigInt(filters.endDate)) return false;
        if (filters.evidenceType && evidence.evidenceType !== filters.evidenceType) return false;
        if (filters.typeFilter && evidence.evidenceType !== filters.typeFilter) return false;
        if (filters.platformFilter && evidence.platform !== filters.platformFilter) return false;
        return true;
      });
    },
    enabled: !!actor && !isFetching,
  });
}
