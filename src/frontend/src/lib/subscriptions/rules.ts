import { SubscriptionStatus, SubscriptionPlan } from '../../types/backend-extended';

export interface EntitlementStatus {
  isEntitled: boolean;
  isTrial: boolean;
  isPro: boolean;
  isExpired: boolean;
  planName: string;
  expiresAt: Date | null;
  daysRemaining: number | null;
}

export function evaluateEntitlement(status: SubscriptionStatus): EntitlementStatus {
  const now = Date.now();
  const endTime = status.endTime ? Number(status.endTime) / 1_000_000 : null;
  const expiresAt = endTime ? new Date(endTime) : null;
  
  const isExpired = endTime ? now > endTime : false;
  const daysRemaining = endTime && !isExpired 
    ? Math.ceil((endTime - now) / (1000 * 60 * 60 * 24))
    : null;

  const isTrial = status.currentPlan === 'free_24h';
  const isPro = status.currentPlan === 'pro_monthly' || status.currentPlan === 'pro_annual';
  const isEntitled = !isExpired;

  let planName = 'Gratuito';
  if (status.currentPlan === 'pro_monthly') planName = 'Pro Mensal';
  if (status.currentPlan === 'pro_annual') planName = 'Pro Anual';

  return {
    isEntitled,
    isTrial,
    isPro,
    isExpired,
    planName,
    expiresAt,
    daysRemaining,
  };
}

export function formatExpiryDate(date: Date | null): string {
  if (!date) return 'Não disponível';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
