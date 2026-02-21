// Extended types that should be in the backend but are missing from the interface
// These match the internal backend types but need to be defined here for frontend use

import type { Platform as BackendPlatform, Principal as BackendPrincipal } from '../backend';

// Re-export Platform and Principal as values (enums can be used as both types and values)
export { Platform } from '../backend';
export type { Principal } from '../backend';

// Region enum - not exported from backend
export enum Region {
  fortaleza = 'fortaleza',
  caucaia = 'caucaia',
  maracanau = 'maracanau',
}

// EvidenceType enum - not exported from backend
export enum EvidenceType {
  selfie = 'selfie',
  screenshot = 'screenshot',
  audio = 'audio',
  video = 'video',
}

// Evidence interface - not exported from backend
export interface Evidence {
  id: bigint;
  owner: BackendPrincipal;
  uploadTime: bigint;
  evidenceType: EvidenceType;
  notes: string;
  platform?: BackendPlatform;
  regiao?: Region;
  bairro?: string;
  duration?: bigint;
  audioQuality?: string;
  videoQuality?: string;
}

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
  owner: BackendPrincipal;
  platform: BackendPlatform;
  reasonCategory: ReasonCategory;
  userExplanation: string;
  evidenceIds: bigint[];
  generatedText: string;
  createdTime: bigint;
}

export interface CollectiveReport {
  platform: BackendPlatform;
  region: Region;
  neighborhood: string;
  reason: ReasonCategory;
  timestamp: bigint;
}

export interface PublicLossProfile {
  dailyEarnings: number;
  daysPerWeek: bigint;
  deactivationDate: bigint;
  platform: BackendPlatform;
}

// Subscription types - not exported from backend
export type SubscriptionPlan = 'free_24h' | 'pro_monthly' | 'pro_annual';

export interface SubscriptionStatus {
  currentPlan: SubscriptionPlan;
  startTime: bigint | null;
  endTime: bigint | null;
}

// Testimonial types - not exported from backend
export enum TestimonialStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}

export interface Testimonial {
  id: bigint;
  submitter: BackendPrincipal;
  content: string;
  timestamp: bigint;
  status: TestimonialStatus;
}

// Payment types - not exported from backend
export interface PaymentCheckoutResponse {
  checkoutUrl: string | null;
  paymentId: string;
}

export interface PaymentStatus {
  paymentId: string;
  status: string;
  rawResponse: string;
}

// User access types - not exported from backend
export interface UserAccessInfo {
  principal: BackendPrincipal;
  profile: any | null;
  subscriptionStatus: SubscriptionStatus;
  isBlockedByAdmin: boolean;
}
