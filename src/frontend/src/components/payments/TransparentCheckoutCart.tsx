import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Check, CreditCard, Loader2, Sparkles, Info } from 'lucide-react';
import { getPlanById } from '../../lib/subscriptions/plans';
import { SubscriptionPlan } from '../../types/backend-extended';
import TrustBadges from '../trust/TrustBadges';

interface TransparentCheckoutCartProps {
  selectedPlan: SubscriptionPlan;
  onPayWithCard: () => void;
  isProcessing: boolean;
  errorMessage?: string | null;
  provider: 'gateway' | 'pagbank';
}

export default function TransparentCheckoutCart({
  selectedPlan,
  onPayWithCard,
  isProcessing,
  errorMessage,
  provider,
}: TransparentCheckoutCartProps) {
  const plan = getPlanById(selectedPlan);

  if (!plan) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Plano não encontrado</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-2 shadow-xl">
      <CardHeader className="bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              Carrinho de Compra
              {plan.discount && (
                <Badge className="bg-destructive text-destructive-foreground">
                  {plan.discount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-base mt-1">
              Revise e finalize sua assinatura
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Selected Plan Summary */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xl">{plan.name}</h3>
                {plan.highlighted && (
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
              <p className="text-xs text-muted-foreground">{plan.billingPeriod}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{plan.price}</div>
            </div>
          </div>

          {/* Features Included */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Recursos Inclusos
            </h4>
            <div className="grid gap-2">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {plan.limitations && plan.limitations.length > 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Limitações:</strong> {plan.limitations.join(', ')}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Separator />

        {/* Payment Method */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Forma de Pagamento
          </h4>

          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>PIX:</strong> Use o QR Code ao lado para pagamento instantâneo via PIX
              </AlertDescription>
            </Alert>

            <Button
              onClick={onPayWithCard}
              disabled={isProcessing}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  {provider === 'pagbank' ? 'Pagar com Cartão (PagBank)' : 'Pagar com Cartão'}
                </>
              )}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Trust Badges */}
        <TrustBadges />

        {/* Total */}
        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-bold text-2xl text-primary">{plan.price}</span>
        </div>
      </CardContent>
    </Card>
  );
}
