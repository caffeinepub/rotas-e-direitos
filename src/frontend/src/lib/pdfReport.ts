import { PublicLossProfile } from '../types/backend-extended';
import { calculateWeeklyLoss, calculateMonthlyLoss, calculateAccumulatedLoss } from './lossCalculations';

export function generateLossReport(profile: PublicLossProfile): Blob {
  const weeklyLoss = calculateWeeklyLoss(profile);
  const monthlyLoss = calculateMonthlyLoss(profile);
  const accumulatedLoss = calculateAccumulatedLoss(profile);
  const deactivationDate = new Date(Number(profile.deactivationDate));

  const reportText = `
LOSS REPORT
===========

Platform: ${profile.platform}
Deactivation Date: ${deactivationDate.toLocaleDateString()}
Daily Earnings: R$ ${profile.dailyEarnings.toFixed(2)}
Days Per Week: ${profile.daysPerWeek}

CALCULATED LOSSES
=================

Weekly Loss: R$ ${weeklyLoss.toFixed(2)}
Monthly Loss: R$ ${monthlyLoss.toFixed(2)}
Accumulated Loss: R$ ${accumulatedLoss.toFixed(2)}

Generated on: ${new Date().toLocaleString()}
  `.trim();

  return new Blob([reportText], { type: 'text/plain' });
}
