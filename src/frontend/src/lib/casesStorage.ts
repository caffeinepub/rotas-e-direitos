import { Case, CreateCaseParams, CaseStatus, TimelineEvent } from '../types/case';

const STORAGE_KEY_PREFIX = 'rotas_cases_';

function getStorageKey(principal: string): string {
  return `${STORAGE_KEY_PREFIX}${principal}`;
}

function generateId(): string {
  return `case_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateEventId(): string {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getAllCases(principal: string): Case[] {
  try {
    const key = getStorageKey(principal);
    const data = localStorage.getItem(key);
    if (!data) return [];
    return JSON.parse(data) as Case[];
  } catch (error) {
    console.error('Failed to load cases:', error);
    return [];
  }
}

export function getCaseById(principal: string, caseId: string): Case | null {
  const cases = getAllCases(principal);
  return cases.find((c) => c.id === caseId) || null;
}

export function createCase(principal: string, params: CreateCaseParams): Case {
  const now = Date.now();
  const newCase: Case = {
    id: generateId(),
    owner: principal,
    createdAt: now,
    updatedAt: now,
    status: 'draft',
    platform: params.platform,
    blockDate: params.blockDate,
    blockTime: params.blockTime,
    reasonCategory: params.reasonCategory,
    incidentSummary: params.incidentSummary,
    evidenceIds: [],
    appealIds: [],
    timeline: [
      {
        id: generateEventId(),
        timestamp: now,
        type: 'created',
        description: 'Case created',
        metadata: { platform: params.platform, reason: params.reasonCategory },
      },
    ],
    notes: '',
  };

  const cases = getAllCases(principal);
  cases.push(newCase);
  saveCases(principal, cases);
  return newCase;
}

export function updateCase(principal: string, caseId: string, updates: Partial<Case>): Case | null {
  const cases = getAllCases(principal);
  const index = cases.findIndex((c) => c.id === caseId);
  if (index === -1) return null;

  const updatedCase = {
    ...cases[index],
    ...updates,
    updatedAt: Date.now(),
  };
  cases[index] = updatedCase;
  saveCases(principal, cases);
  return updatedCase;
}

export function addEvidenceToCase(principal: string, caseId: string, evidenceId: number): Case | null {
  const cases = getAllCases(principal);
  const caseIndex = cases.findIndex((c) => c.id === caseId);
  if (caseIndex === -1) return null;

  const existingCase = cases[caseIndex];
  const alreadyAttached = existingCase.evidenceIds.some((e) => e.evidenceId === evidenceId);
  if (alreadyAttached) return existingCase;

  const now = Date.now();
  const updatedCase: Case = {
    ...existingCase,
    evidenceIds: [...existingCase.evidenceIds, { evidenceId, attachedAt: now }],
    timeline: [
      ...existingCase.timeline,
      {
        id: generateEventId(),
        timestamp: now,
        type: 'evidence_added',
        description: `Evidence #${evidenceId} attached`,
        metadata: { evidenceId },
      },
    ],
    updatedAt: now,
  };

  cases[caseIndex] = updatedCase;
  saveCases(principal, cases);
  return updatedCase;
}

export function addAppealToCase(principal: string, caseId: string, appealId: number): Case | null {
  const cases = getAllCases(principal);
  const caseIndex = cases.findIndex((c) => c.id === caseId);
  if (caseIndex === -1) return null;

  const existingCase = cases[caseIndex];
  const alreadyLinked = existingCase.appealIds.some((a) => a.appealId === appealId);
  if (alreadyLinked) return existingCase;

  const now = Date.now();
  const updatedCase: Case = {
    ...existingCase,
    appealIds: [...existingCase.appealIds, { appealId, generatedAt: now }],
    timeline: [
      ...existingCase.timeline,
      {
        id: generateEventId(),
        timestamp: now,
        type: 'appeal_generated',
        description: `Appeal #${appealId} generated`,
        metadata: { appealId },
      },
    ],
    updatedAt: now,
  };

  cases[caseIndex] = updatedCase;
  saveCases(principal, cases);
  return updatedCase;
}

export function addTimelineEvent(
  principal: string,
  caseId: string,
  event: Omit<TimelineEvent, 'id' | 'timestamp'>
): Case | null {
  const cases = getAllCases(principal);
  const caseIndex = cases.findIndex((c) => c.id === caseId);
  if (caseIndex === -1) return null;

  const existingCase = cases[caseIndex];
  const now = Date.now();
  const newEvent: TimelineEvent = {
    ...event,
    id: generateEventId(),
    timestamp: now,
  };

  const updatedCase: Case = {
    ...existingCase,
    timeline: [...existingCase.timeline, newEvent],
    updatedAt: now,
  };

  cases[caseIndex] = updatedCase;
  saveCases(principal, cases);
  return updatedCase;
}

function saveCases(principal: string, cases: Case[]): void {
  try {
    const key = getStorageKey(principal);
    localStorage.setItem(key, JSON.stringify(cases));
  } catch (error) {
    console.error('Failed to save cases:', error);
  }
}
