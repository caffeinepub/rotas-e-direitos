// Extended types that should be in the backend but are missing from the interface
// These match the internal backend types but need to be defined here for frontend use

import type { Platform, Region, Principal } from '../backend';

// Re-export types from backend for convenience
export type { Platform, Region, Principal };

export enum ReasonCategory {
  documentsExpired = 'documentsExpired',
  selfieInvalid = 'selfieInvalid',
  lowRating = 'lowRating',
  dangerousConduct = 'dangerousConduct',
  fraudSuspicion = 'fraudSuspicion',
  multipleAccounts = 'multipleAccounts',
  other = 'other',
}

export interface Appeal {
  id: bigint;
  owner: Principal;
  platform: Platform;
  reasonCategory: ReasonCategory;
  userExplanation: string;
  evidenceIds: bigint[];
  generatedText: string;
  createdTime: bigint;
}

export interface CollectiveReport {
  platform: Platform;
  region: Region;
  neighborhood: string;
  reason: ReasonCategory;
  timestamp: bigint;
}

export interface PublicLossProfile {
  dailyEarnings: number;
  daysPerWeek: bigint;
  deactivationDate: bigint;
  platform: Platform;
}
