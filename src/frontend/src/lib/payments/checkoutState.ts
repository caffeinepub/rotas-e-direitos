import { SubscriptionPlan } from '../../backend';

const CHECKOUT_PLAN_KEY = 'checkout_selected_plan';

export function saveSelectedPlan(planId: SubscriptionPlan): void {
  sessionStorage.setItem(CHECKOUT_PLAN_KEY, planId);
}

export function getSelectedPlan(): SubscriptionPlan | null {
  const stored = sessionStorage.getItem(CHECKOUT_PLAN_KEY);
  return stored as SubscriptionPlan | null;
}

export function clearSelectedPlan(): void {
  sessionStorage.removeItem(CHECKOUT_PLAN_KEY);
}
