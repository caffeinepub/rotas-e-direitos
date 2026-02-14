import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Calendar, CreditCard } from 'lucide-react';
import { PLANS } from '../lib/subscriptions/plans';
import { useEntitlement } from '../hooks/useSubscription';
import { formatExpiryDate } from '../lib/subscriptions/rules';
import { saveSelectedPlan } from '../lib/payments/checkoutState';

export default function PlansDashboardPage() {
  const navigate = useNavigate();
  const entitlement = useEntitlement();

  const handleUpgrade = (planId: string) => {
    saveSelectedPlan(planId as any);
    navigate({ to: '/checkout' });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Painel de Assinatura</h1>
        <p className="text-xl text-muted-foreground">
          Gerencie sua assinatura e compare os benefícios de cada plano
        </p>
      </div>

      {entitlement && (
        <Card className="border-primary/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Sua Assinatura Atual</CardTitle>
              <Badge variant={entitlement.isExpired ? 'destructive' : 'default'} className="text-base px-4 py-2">
                {entitlement.planName}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    {entitlement.isExpired ? 'Expirou em' : 'Expira em'}
                  </div>
                  <div className="font-medium">{formatExpiryDate(entitlement.expiresAt)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="font-medium">
                    {entitlement.isExpired
                      ? 'Expirado'
                      : entitlement.daysRemaining !== null
                      ? `${entitlement.daysRemaining} dias restantes`
                      : 'Ativo'}
                  </div>
                </div>
              </div>
            </div>
            {!entitlement.isPro && !entitlement.isExpired && (
              <Button onClick={() => navigate({ to: '/planos' })} size="lg" className="w-full md:w-auto">
                Fazer Upgrade para Pro
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Compare os Planos</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <Card key={plan.id} className={plan.highlighted ? 'border-primary' : ''}>
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">{plan.price}</div>
                <CardDescription>{plan.billingPeriod}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.id !== 'free_24h' && (
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? 'default' : 'outline'}
                    onClick={() => handleUpgrade(plan.id)}
                  >
                    Selecionar Plano
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
