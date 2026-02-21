import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { usePublicPaymentConfig } from '../hooks/usePublicPaymentConfig';
import { useGatewayPayment } from '../hooks/useGatewayPayment';
import { usePagBankPayment } from '../hooks/usePagBankPayment';
import { getSelectedPlan, clearSelectedPlan } from '../lib/payments/checkoutState';
import { getActiveProvider } from '../lib/payments/providerConfig';
import { getPlanById } from '../lib/subscriptions/plans';
import { sanitizeGatewayError } from '../lib/payments/gatewayErrorMessages';
import { sanitizePagBankError } from '../lib/payments/pagbankErrorMessages';
import PaymentStatusPanel from '../components/payments/PaymentStatusPanel';
import PixQrCodeDisplay from '../components/payments/PixQrCodeDisplay';
import TransparentCheckoutCart from '../components/payments/TransparentCheckoutCart';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const selectedPlan = getSelectedPlan();
  const plan = selectedPlan ? getPlanById(selectedPlan) : null;

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
    if (!plan || !selectedPlan) return;
    
    setErrorMessage(null);
    
    try {
      await startPayment(selectedPlan);
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

  if (!plan || !selectedPlan) {
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
          Checkout Simplificado
        </h1>
        <p className="text-muted-foreground mt-2">Finalize sua assinatura de forma rápida e segura</p>
      </div>

      {/* Two-column layout on desktop, single column on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Transparent Checkout Cart */}
        <div className="lg:col-span-2 space-y-6">
          {flowStatus.state !== 'idle' ? (
            <PaymentStatusPanel
              flowStatus={flowStatus}
              onRetry={handleRetry}
              onCheckStatus={handleCheckStatus}
              isCheckingStatus={isCheckingStatus}
              provider={activeProvider}
            />
          ) : (
            <TransparentCheckoutCart
              selectedPlan={selectedPlan}
              onPayWithCard={handleInitiatePayment}
              isProcessing={isInitiating}
              errorMessage={errorMessage}
              provider={activeProvider}
            />
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
