import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { PLANS } from '../lib/subscriptions/plans';
import { saveSelectedPlan } from '../lib/payments/checkoutState';
import { useEntitlement } from '../hooks/useSubscription';
import TrustBadges from '../components/trust/TrustBadges';

export default function PlansBillingPage() {
  const navigate = useNavigate();
  const entitlement = useEntitlement();

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free_24h') {
      return;
    }
    saveSelectedPlan(planId as any);
    navigate({ to: '/checkout' });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Planos e Assinatura</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Escolha o plano ideal para defender seus direitos como entregador
        </p>
        {entitlement && (
          <Badge variant="outline" className="text-base px-4 py-2">
            Plano Atual: {entitlement.planName}
            {entitlement.daysRemaining !== null && ` • ${entitlement.daysRemaining} dias restantes`}
          </Badge>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.highlighted ? 'border-primary border-2 shadow-lg scale-105' : ''
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="text-sm px-4 py-1">Mais Popular</Badge>
              </div>
            )}
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div>
                <div className="text-4xl font-bold">{plan.price}</div>
                <div className="text-sm text-muted-foreground">{plan.billingPeriod}</div>
              </div>
              <CardDescription className="text-base">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                size="lg"
                variant={plan.highlighted ? 'default' : 'outline'}
                onClick={() => handleSelectPlan(plan.id)}
                disabled={plan.id === 'free_24h'}
              >
                {plan.id === 'free_24h' ? 'Plano Inicial' : 'Assinar Agora'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <TrustBadges />

      <Card className="bg-accent/50">
        <CardContent className="pt-6">
          <p className="text-center text-sm text-muted-foreground">
            Todos os planos incluem acesso completo às ferramentas de evidências, calculadora de perdas,
            gerador de recursos e dados coletivos. Cancele a qualquer momento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
