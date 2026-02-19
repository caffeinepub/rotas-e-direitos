import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Info, CreditCard } from 'lucide-react';
import { usePublicPaymentConfig } from '../hooks/usePublicPaymentConfig';
import { useGatewayPayment } from '../hooks/useGatewayPayment';
import { getSelectedPlan, clearSelectedPlan } from '../lib/payments/checkoutState';
import { PLANS } from '../lib/subscriptions/plans';
import { sanitizeGatewayError } from '../lib/payments/gatewayErrorMessages';
import TrustBadges from '../components/trust/TrustBadges';
import PaymentStatusPanel from '../components/payments/PaymentStatusPanel';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const selectedPlan = getSelectedPlan();
  const plan = selectedPlan ? PLANS.find((p) => p.id === selectedPlan) : null;

  const { data: publicConfig, isLoading: configLoading } = usePublicPaymentConfig();
  const { flowStatus, startPayment, checkStatus, reset, isInitiating, isCheckingStatus } = useGatewayPayment();
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedPlan) {
      navigate({ to: '/planos' });
    }
  }, [selectedPlan, navigate]);

  // Clear selected plan when payment is completed
  useEffect(() => {
    if (flowStatus.state === 'completed') {
      clearSelectedPlan();
    }
  }, [flowStatus.state]);

  const handleInitiatePayment = async () => {
    if (!plan) return;
    
    setErrorMessage(null);
    
    try {
      await startPayment(plan.id);
    } catch (error: any) {
      const sanitized = sanitizeGatewayError(error);
      setErrorMessage(sanitized.message);
    }
  };

  const handleCheckStatus = async () => {
    if (!flowStatus.paymentId) return;
    
    try {
      await checkStatus(flowStatus.paymentId);
    } catch (error: any) {
      const sanitized = sanitizeGatewayError(error);
      setErrorMessage(sanitized.message);
    }
  };

  const handleRetry = () => {
    reset();
    setErrorMessage(null);
  };

  if (!plan) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (configLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const gatewayEnabled = publicConfig?.gatewayProvider?.enabled || false;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground">Complete sua assinatura</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plano Selecionado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{plan.price}</p>
                  <p className="text-sm text-muted-foreground">{plan.billingPeriod}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Status Panel */}
          {flowStatus.state !== 'idle' && (
            <PaymentStatusPanel 
              flowStatus={flowStatus}
              onRetry={handleRetry}
              onCheckStatus={handleCheckStatus}
              isCheckingStatus={isCheckingStatus}
            />
          )}

          {/* Payment Method Card - only show when idle */}
          {flowStatus.state === 'idle' && (
            <Card>
              <CardHeader>
                <CardTitle>Método de Pagamento</CardTitle>
                <CardDescription>Escolha como deseja pagar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!gatewayEnabled ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-medium mb-2">Gateway de Pagamento em Configuração</p>
                      <p className="text-sm text-muted-foreground">
                        Nosso gateway de pagamento está sendo configurado. Por favor, volte em breve para completar sua compra.
                      </p>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div className="space-y-3">
                      <Button 
                        onClick={handleInitiatePayment}
                        disabled={isInitiating}
                        className="w-full h-auto py-4"
                        size="lg"
                      >
                        {isInitiating ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Processando...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-5 w-5 mr-2" />
                            Pagar com Gateway
                          </>
                        )}
                      </Button>
                    </div>

                    {errorMessage && (
                      <Alert variant="destructive">
                        <AlertDescription>{errorMessage}</AlertDescription>
                      </Alert>
                    )}

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Você será redirecionado para completar o pagamento de forma segura.
                      </AlertDescription>
                    </Alert>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plano</span>
                <span className="font-medium">{plan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cobrança</span>
                <span className="font-medium">{plan.billingPeriod}</span>
              </div>
              <div className="border-t pt-4 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold">{plan.price}</span>
              </div>
            </CardContent>
          </Card>

          <TrustBadges />
        </div>
      </div>
    </div>
  );
}
