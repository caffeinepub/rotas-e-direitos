import { PublicLossProfile } from '../backend';

export interface LossCalculations {
  weekly: number;
  monthly: number;
  accumulated: number;
  daysSince: number;
  projection30: number;
  projection60: number;
  projection90: number;
}

export function calculateLosses(profile: PublicLossProfile): LossCalculations {
  const dailyEarnings = profile.dailyEarnings;
  const daysPerWeek = Number(profile.daysPerWeek);
  const deactivationDate = new Date(Number(profile.deactivationDate) / 1000000);
  const now = new Date();

  const daysSince = Math.floor((now.getTime() - deactivationDate.getTime()) / (1000 * 60 * 60 * 24));

  const weekly = dailyEarnings * daysPerWeek;
  const monthly = weekly * 4.3;
  const accumulated = dailyEarnings * daysSince;

  const projection30 = dailyEarnings * 30;
  const projection60 = dailyEarnings * 60;
  const projection90 = dailyEarnings * 90;

  return {
    weekly,
    monthly,
    accumulated,
    daysSince,
    projection30,
    projection60,
    projection90,
  };
}
