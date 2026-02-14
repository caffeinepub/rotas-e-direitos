import { SubscriptionPlan } from '../../backend';

export interface PlanDefinition {
  id: SubscriptionPlan;
  name: string;
  price: string;
  priceValue: number;
  billingPeriod: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export const PLANS: PlanDefinition[] = [
  {
    id: 'free_24h' as SubscriptionPlan,
    name: 'Gratuito',
    price: 'R$ 0,00',
    priceValue: 0,
    billingPeriod: '24 horas',
    description: 'Teste todas as funcionalidades por 24 horas',
    features: [
      'Acesso completo por 24 horas',
      'Rastreador de evidências',
      'Calculadora de perdas',
      'Gerador de recursos',
      'Dados coletivos',
      'Suporte básico',
    ],
  },
  {
    id: 'pro_monthly' as SubscriptionPlan,
    name: 'Pro Mensal',
    price: 'R$ 29,99',
    priceValue: 29.99,
    billingPeriod: 'por mês',
    description: 'Acesso ilimitado com renovação mensal',
    features: [
      'Todos os recursos liberados',
      'Armazenamento ilimitado de evidências',
      'Exportação de relatórios',
      'Geração ilimitada de recursos',
      'Acesso prioritário a novos recursos',
      'Suporte prioritário',
    ],
    highlighted: true,
  },
  {
    id: 'pro_annual' as SubscriptionPlan,
    name: 'Pro Anual',
    price: 'R$ 329,90',
    priceValue: 329.90,
    billingPeriod: 'por ano',
    description: 'Melhor valor - economize mais de 8%',
    features: [
      'Todos os recursos Pro Mensal',
      'Economia de R$ 29,98 por ano',
      'Garantia de preço por 12 meses',
      'Acesso vitalício a recursos lançados no período',
      'Suporte premium',
      'Consultoria jurídica básica (em breve)',
    ],
  },
];

export function getPlanById(planId: SubscriptionPlan): PlanDefinition | undefined {
  return PLANS.find((p) => p.id === planId);
}
