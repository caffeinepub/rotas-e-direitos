import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from './useInternetIdentity';
import { Case, CreateCaseParams, CaseStatus } from '../types/case';
import * as casesStorage from '../lib/casesStorage';

export function useGetAllCases() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() || '';

  return useQuery<Case[]>({
    queryKey: ['cases', principal],
    queryFn: () => casesStorage.getAllCases(principal),
    enabled: !!principal,
  });
}

export function useGetCaseById(caseId: string) {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() || '';

  return useQuery<Case | null>({
    queryKey: ['cases', principal, caseId],
    queryFn: () => casesStorage.getCaseById(principal, caseId),
    enabled: !!principal && !!caseId,
  });
}

export function useCreateCase() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const principal = identity?.getPrincipal().toString() || '';

  return useMutation({
    mutationFn: (params: CreateCaseParams) => {
      return Promise.resolve(casesStorage.createCase(principal, params));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases', principal] });
    },
  });
}

export function useUpdateCase() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const principal = identity?.getPrincipal().toString() || '';

  return useMutation({
    mutationFn: ({ caseId, updates }: { caseId: string; updates: Partial<Case> }) => {
      return Promise.resolve(casesStorage.updateCase(principal, caseId, updates));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cases', principal] });
      queryClient.invalidateQueries({ queryKey: ['cases', principal, variables.caseId] });
    },
  });
}

export function useAttachEvidenceToCase() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const principal = identity?.getPrincipal().toString() || '';

  return useMutation({
    mutationFn: ({ caseId, evidenceId }: { caseId: string; evidenceId: number }) => {
      return Promise.resolve(casesStorage.addEvidenceToCase(principal, caseId, evidenceId));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cases', principal] });
      queryClient.invalidateQueries({ queryKey: ['cases', principal, variables.caseId] });
    },
  });
}

export function useAttachAppealToCase() {
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const principal = identity?.getPrincipal().toString() || '';

  return useMutation({
    mutationFn: ({ caseId, appealId }: { caseId: string; appealId: number }) => {
      return Promise.resolve(casesStorage.addAppealToCase(principal, caseId, appealId));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cases', principal] });
      queryClient.invalidateQueries({ queryKey: ['cases', principal, variables.caseId] });
    },
  });
}
