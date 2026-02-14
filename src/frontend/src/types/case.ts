export interface CaseEvidence {
  evidenceId: number;
  attachedAt: number;
}

export interface CaseAppeal {
  appealId: number;
  generatedAt: number;
}

export interface TimelineEvent {
  id: string;
  timestamp: number;
  type: 'created' | 'evidence_added' | 'appeal_generated' | 'status_changed' | 'note_added';
  description: string;
  metadata?: Record<string, any>;
}

export type CaseStatus = 'draft' | 'active' | 'under_review' | 'resolved' | 'closed';

export interface Case {
  id: string;
  owner: string;
  createdAt: number;
  updatedAt: number;
  status: CaseStatus;
  platform: string;
  blockDate: number;
  blockTime: string;
  reasonCategory: string;
  incidentSummary: string;
  evidenceIds: CaseEvidence[];
  appealIds: CaseAppeal[];
  timeline: TimelineEvent[];
  notes: string;
}

export interface CreateCaseParams {
  platform: string;
  blockDate: number;
  blockTime: string;
  reasonCategory: string;
  incidentSummary: string;
}
