import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Info, CreditCard, Check, Sparkles } from 'lucide-react';
import { usePublicPaymentConfig } from '../hooks/usePublicPaymentConfig';
import { useGatewayPayment } from '../hooks/useGatewayPayment';
import { usePagBankPayment } from '../hooks/usePagBankPayment';
import { getSelectedPlan, clearSelectedPlan } from '../lib/payments/checkoutState';
import { getActiveProvider } from '../lib/payments/providerConfig';
import { PLANS } from '../lib/subscriptions/plans';
import { sanitizeGatewayError } from '../lib/payments/gatewayErrorMessages';
import { sanitizePagBankError } from '../lib/payments/pagbankErrorMessages';
import TrustBadges from '../components/trust/TrustBadges';
import PaymentStatusPanel from '../components/payments/PaymentStatusPanel';
import PixQrCodeDisplay from '../components/payments/PixQrCodeDisplay';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const selectedPlan = getSelectedPlan();
  const plan = selectedPlan ? PLANS.find((p) => p.id === selectedPlan) : null;

  const { data: publicConfig, isLoading: configLoading } = usePublicPaymentConfig();
  const activeProvider = getActiveProvider(publicConfig);
  
  // Initialize both payment hooks
  const gatewayPayment = useGatewayPayment();
  const pagbankPayment = usePagBankPayment();
  
  // Select the appropriate payment hook based on active provider
  const paymentHook = activeProvider === 'pagbank' ? pagbankPayment : gatewayPayment;
  const { flowStatus, startPayment, checkStatus, reset, isInitiating, isCheckingStatus } = paymentHook;
  
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
      const sanitized = activeProvider === 'pagbank' 
        ? sanitizePagBankError(error)
        : sanitizeGatewayError(error);
      setErrorMessage(sanitized.message);
    }
  };

  const handleCheckStatus = async () => {
    if (!flowStatus.paymentId) return;
    
    try {
      await checkStatus(flowStatus.paymentId);
    } catch (error: any) {
      const sanitized = activeProvider === 'pagbank'
        ? sanitizePagBankError(error)
        : sanitizeGatewayError(error);
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

  if (!activeProvider) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="text-muted-foreground">Finalize sua assinatura</p>
        </div>

        <Alert variant="destructive">
          <AlertDescription>
            Nenhum provedor de pagamento está habilitado no momento. Entre em contato com o suporte.
          </AlertDescription>
        </Alert>

        <Button onClick={() => navigate({ to: '/planos' })} variant="outline">
          Voltar aos Planos
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Finalizar Assinatura
        </h1>
        <p className="text-muted-foreground mt-2">Complete seu pagamento e comece a usar todos os recursos</p>
      </div>

      {/* Two-column layout on desktop, single column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plans Comparison */}
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Planos Disponíveis</CardTitle>
              <CardDescription>Compare os benefícios de cada plano</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLANS.map((p) => (
                  <div
                    key={p.id}
                    className={`relative rounded-lg border-2 p-4 transition-all ${
                      p.id === selectedPlan
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border bg-card hover:border-muted-foreground/30'
                    }`}
                  >
                    {p.id === selectedPlan && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                        Selecionado
                      </Badge>
                    )}
                    {p.highlighted && p.id !== selectedPlan && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    <div className="text-center mb-4">
                      <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                      <div className="text-3xl font-bold text-primary mb-1">{p.price}</div>
                      <div className="text-xs text-muted-foreground">{p.billingPeriod}</div>
                    </div>
                    <ul className="space-y-2 text-sm">
                      {p.features.slice(0, 4).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Resumo do Pedido
              </CardTitle>
              <CardDescription>Revise os detalhes da sua assinatura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <div className="font-semibold text-lg">{plan.name}</div>
                  <div className="text-sm text-muted-foreground">{plan.description}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-2xl text-primary">{plan.price}</div>
                  <div className="text-xs text-muted-foreground">{plan.billingPeriod}</div>
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Provedor de pagamento: <strong>{activeProvider === 'pagbank' ? 'PagBank' : 'Gateway'}</strong>
                </AlertDescription>
              </Alert>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3">Recursos inclusos:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Status or Alternative Payment */}
          {flowStatus.state !== 'idle' ? (
            <PaymentStatusPanel
              flowStatus={flowStatus}
              onRetry={handleRetry}
              onCheckStatus={handleCheckStatus}
              isCheckingStatus={isCheckingStatus}
              provider={activeProvider}
            />
          ) : (
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle>Outras Formas de Pagamento</CardTitle>
                <CardDescription>
                  Prefere pagar com cartão? Use a opção abaixo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleInitiatePayment}
                  disabled={isInitiating}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  {isInitiating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Iniciando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      {activeProvider === 'pagbank' 
                        ? 'Pagar com PagBank (Cartão)' 
                        : 'Pagar com Cartão'}
                    </>
                  )}
                </Button>

                <TrustBadges />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Sticky PIX QR Code */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <PixQrCodeDisplay />
          </div>
        </div>
      </div>
    </div>
  );
}
