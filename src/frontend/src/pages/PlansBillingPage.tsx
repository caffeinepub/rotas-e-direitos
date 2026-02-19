import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { useGetSubscriptionStatus } from '../hooks/useSubscription';
import { useNavigate } from '@tanstack/react-router';
import { PLANS } from '../lib/subscriptions/plans';
import { evaluateEntitlement, formatExpiryDate } from '../lib/subscriptions/rules';
import TrustBadges from '../components/trust/TrustBadges';

export default function PlansBillingPage() {
  const { data: subscriptionStatus, isLoading } = useGetSubscriptionStatus();
  const navigate = useNavigate();

  const userEntitlement = subscriptionStatus ? evaluateEntitlement(subscriptionStatus) : null;

  const handleUpgrade = (planId: string) => {
    navigate({ to: '/checkout', search: { plan: planId } });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Planos e Assinatura
        </h1>
        <p className="text-xl text-muted-foreground">
          Escolha o plano ideal para proteger seus direitos
        </p>
      </div>

      {userEntitlement && (
        <Card className="bg-gradient-to-br from-primary/8 to-accent/8 border-primary/20 shadow-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Plano Atual</p>
                <p className="text-2xl font-bold text-foreground">{userEntitlement.planName}</p>
                {userEntitlement.expiresAt && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {userEntitlement.isExpired ? 'Expirou em' : 'Válido até'}{' '}
                    {formatExpiryDate(userEntitlement.expiresAt)}
                  </p>
                )}
              </div>
              {userEntitlement.isExpired && (
                <Badge variant="destructive" className="text-sm px-3 py-1">
                  Expirado
                </Badge>
              )}
              {userEntitlement.isTrial && !userEntitlement.isExpired && (
                <Badge variant="outline" className="text-sm px-3 py-1 border-accent text-accent">
                  Período de Teste
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrentPlan = subscriptionStatus?.currentPlan === plan.id;
          const isPro = plan.highlighted;

          return (
            <Card
              key={plan.id}
              className={`relative transition-all hover:shadow-xl ${
                isPro
                  ? 'border-primary/40 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5'
                  : 'border-border/60 shadow-md'
              }`}
            >
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 shadow-md">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Recomendado
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.billingPeriod && (
                    <span className="text-muted-foreground ml-2">/ {plan.billingPeriod}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground/90">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full shadow-sm hover:shadow-md transition-all"
                  variant={isPro ? 'default' : 'outline'}
                  size="lg"
                  disabled={isCurrentPlan}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {isCurrentPlan ? 'Plano Atual' : 'Selecionar Plano'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <TrustBadges />
    </div>
  );
}
