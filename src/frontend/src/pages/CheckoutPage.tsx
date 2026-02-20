import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Info, CreditCard } from 'lucide-react';
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
  const [showPixQrCode, setShowPixQrCode] = useState(false);

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
    setShowPixQrCode(false);
  };

  const handleShowPixQrCode = () => {
    setShowPixQrCode(true);
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground">Finalize sua assinatura {plan.name}</p>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Pedido</CardTitle>
          <CardDescription>Revise os detalhes da sua assinatura</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{plan.name}</div>
              <div className="text-sm text-muted-foreground">{plan.description}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">{plan.price}</div>
              <div className="text-xs text-muted-foreground">{plan.billingPeriod}</div>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Provedor de pagamento: <strong>{activeProvider === 'pagbank' ? 'PagBank' : 'Gateway'}</strong>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* PIX QR Code Display */}
      {showPixQrCode && <PixQrCodeDisplay />}

      {/* Payment Status or Initiate Button */}
      {flowStatus.state === 'idle' && !showPixQrCode ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Método de Pagamento
            </CardTitle>
            <CardDescription>
              Escolha como deseja pagar sua assinatura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* PIX Payment Option */}
            <Button
              onClick={handleShowPixQrCode}
              variant="default"
              className="w-full"
              size="lg"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Pagar com PIX
            </Button>

            {/* Alternative Payment Option */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou
                </span>
              </div>
            </div>

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
      ) : flowStatus.state !== 'idle' ? (
        <PaymentStatusPanel
          flowStatus={flowStatus}
          onRetry={handleRetry}
          onCheckStatus={handleCheckStatus}
          isCheckingStatus={isCheckingStatus}
          provider={activeProvider}
        />
      ) : null}
    </div>
  );
}
