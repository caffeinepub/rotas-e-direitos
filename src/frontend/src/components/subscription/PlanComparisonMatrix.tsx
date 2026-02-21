import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Sparkles, Zap } from 'lucide-react';
import { PLANS } from '../../lib/subscriptions/plans';
import { useNavigate } from '@tanstack/react-router';
import { saveSelectedPlan } from '../../lib/payments/checkoutState';

export default function PlanComparisonMatrix() {
  const navigate = useNavigate();

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free_24h') {
      // Free plan - just navigate to dashboard
      navigate({ to: '/dashboard' });
    } else {
      saveSelectedPlan(planId as any);
      navigate({ to: '/checkout' });
    }
  };

  const comparisonFeatures = [
    { label: 'Duração do acesso', free: '24 horas', monthly: '30 dias', annual: '365 dias' },
    { label: 'Defesas incluídas', free: '1 defesa', monthly: '5 defesas/mês', annual: 'Ilimitado' },
    { label: 'Gerador de recursos', free: true, monthly: true, annual: true },
    { label: 'Calculadora de perdas', free: true, monthly: true, annual: true },
    { label: 'Armazenamento de evidências', free: false, monthly: true, annual: true },
    { label: 'Dados coletivos', free: true, monthly: true, annual: true },
    { label: 'Suporte prioritário', free: false, monthly: true, annual: true },
    { label: 'Suporte premium', free: false, monthly: false, annual: true },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Compare os Planos
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Escolha o plano ideal para suas necessidades
        </p>
      </div>

      {/* Mobile: Card View */}
      <div className="grid gap-6 md:hidden">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.highlighted
                ? 'border-primary/40 shadow-xl bg-gradient-to-br from-primary/5 to-accent/5'
                : 'border-border/60 shadow-md'
            }`}
          >
            {plan.discount && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-destructive text-destructive-foreground px-4 py-1 shadow-md">
                  <Zap className="h-3 w-3 mr-1" />
                  {plan.discount}
                </Badge>
              </div>
            )}
            {plan.highlighted && !plan.discount && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1 shadow-md">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              </div>
            )}
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground ml-2">/ {plan.billingPeriod}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.limitations && plan.limitations.length > 0 && (
                <div className="pt-3 border-t">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Limitações:</p>
                  <ul className="space-y-2">
                    {plan.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Button
                className="w-full shadow-sm hover:shadow-md transition-all"
                variant={plan.highlighted ? 'default' : 'outline'}
                size="lg"
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.id === 'free_24h' ? 'Começar Grátis' : 'Selecionar Plano'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop: Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-4 border-b-2 border-border">
                <span className="text-lg font-semibold">Recursos</span>
              </th>
              {PLANS.map((plan) => (
                <th key={plan.id} className="p-4 border-b-2 border-border text-center">
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg font-bold">{plan.name}</span>
                      {plan.discount && (
                        <Badge className="bg-destructive text-destructive-foreground text-xs">
                          {plan.discount}
                        </Badge>
                      )}
                      {plan.highlighted && !plan.discount && (
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <div className="text-2xl font-bold text-primary">{plan.price}</div>
                    <div className="text-xs text-muted-foreground">{plan.billingPeriod}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonFeatures.map((feature, idx) => (
              <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium">{feature.label}</td>
                <td className="p-4 text-center">
                  {typeof feature.free === 'boolean' ? (
                    feature.free ? (
                      <Check className="h-5 w-5 text-success mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground mx-auto" />
                    )
                  ) : (
                    <span className="text-sm">{feature.free}</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {typeof feature.monthly === 'boolean' ? (
                    feature.monthly ? (
                      <Check className="h-5 w-5 text-success mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground mx-auto" />
                    )
                  ) : (
                    <span className="text-sm font-medium">{feature.monthly}</span>
                  )}
                </td>
                <td className="p-4 text-center">
                  {typeof feature.annual === 'boolean' ? (
                    feature.annual ? (
                      <Check className="h-5 w-5 text-success mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground mx-auto" />
                    )
                  ) : (
                    <span className="text-sm font-medium">{feature.annual}</span>
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <td className="p-4"></td>
              {PLANS.map((plan) => (
                <td key={plan.id} className="p-4 text-center">
                  <Button
                    variant={plan.highlighted ? 'default' : 'outline'}
                    size="lg"
                    className="w-full shadow-sm hover:shadow-md transition-all"
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {plan.id === 'free_24h' ? 'Começar Grátis' : 'Selecionar'}
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
