import { SubscriptionPlan } from '../../types/backend-extended';

export interface PlanDefinition {
  id: SubscriptionPlan;
  name: string;
  price: string;
  priceValue: number;
  billingPeriod: string;
  description: string;
  features: string[];
  limitations?: string[];
  highlighted?: boolean;
  discount?: string;
  defensesLimit?: number | 'unlimited';
}

export const PLANS: PlanDefinition[] = [
  {
    id: 'free_24h' as SubscriptionPlan,
    name: 'Gratuito',
    price: 'R$ 0,00',
    priceValue: 0,
    billingPeriod: '24 horas',
    description: 'Teste básico por 24 horas',
    defensesLimit: 1,
    features: [
      'Acesso por 24 horas',
      '1 defesa incluída',
      'Rastreador de evidências',
      'Calculadora de perdas',
    ],
    limitations: [
      'Apenas 1 defesa',
      'Acesso limitado a 24h',
      'Sem armazenamento ilimitado',
    ],
  },
  {
    id: 'pro_monthly' as SubscriptionPlan,
    name: 'PRO Mensal',
    price: 'R$ 29,99',
    priceValue: 29.99,
    billingPeriod: 'por mês',
    description: 'Ideal para uso regular',
    defensesLimit: 5,
    features: [
      '5 defesas por mês',
      'Gerador de recursos ilimitado',
      'Armazenamento de evidências',
      'Calculadora de perdas avançada',
      'Acesso a dados coletivos',
      'Suporte prioritário',
    ],
    highlighted: true,
  },
  {
    id: 'pro_annual' as SubscriptionPlan,
    name: 'PRO Anual',
    price: 'R$ 119,99',
    priceValue: 119.99,
    billingPeriod: 'por ano',
    description: 'Melhor custo-benefício',
    discount: '67% OFF',
    defensesLimit: 'unlimited',
    features: [
      'Tudo ilimitado',
      'Defesas ilimitadas',
      'Todos os recursos PRO',
      'Armazenamento ilimitado',
      'Suporte premium',
      'Economia de R$ 239,89/ano',
    ],
  },
];

export function getPlanById(planId: SubscriptionPlan): PlanDefinition | undefined {
  return PLANS.find((p) => p.id === planId);
}
