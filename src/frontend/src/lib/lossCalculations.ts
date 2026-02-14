import { PublicLossProfile } from '../types/backend-extended';

export function calculateWeeklyLoss(profile: PublicLossProfile): number {
  return profile.dailyEarnings * Number(profile.daysPerWeek);
}

export function calculateMonthlyLoss(profile: PublicLossProfile): number {
  const weeksPerMonth = 4.33;
  return calculateWeeklyLoss(profile) * weeksPerMonth;
}

export function calculateAccumulatedLoss(profile: PublicLossProfile): number {
  const now = Date.now();
  const deactivationDate = Number(profile.deactivationDate);
  const daysSinceDeactivation = Math.max(0, Math.floor((now - deactivationDate) / (1000 * 60 * 60 * 24)));
  return profile.dailyEarnings * daysSinceDeactivation;
}

export function calculateProjectedLoss(profile: PublicLossProfile, daysAhead: number): number {
  return profile.dailyEarnings * daysAhead;
}
