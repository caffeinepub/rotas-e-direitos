import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, QrCode, CheckCircle2 } from 'lucide-react';
import { useCreateMercadoPagoPayment, useCheckPaymentStatus, useConfirmPaymentAndUpgrade } from '../hooks/useMercadoPagoPayment';
import { usePublicPaymentConfig } from '../hooks/usePublicPaymentConfig';
import { getSelectedPlan, clearSelectedPlan } from '../lib/payments/checkoutState';
import { PLANS } from '../lib/subscriptions/plans';
import { SubscriptionPlan } from '../backend';
import { MercadoPagoPaymentResponse, PaymentStatusResponse } from '../types/mercadopago';
import { toast } from 'sonner';
import TrustBadges from '../components/trust/TrustBadges';
import MercadoPagoNextSteps from '../components/payments/MercadoPagoNextSteps';
import PaymentStatusPanel from '../components/payments/PaymentStatusPanel';
import PaymentProviderNotConfigured from '../components/payments/PaymentProviderNotConfigured';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as { payment_id?: string; status?: string };
  const [paymentData, setPaymentData] = useState<MercadoPagoPaymentResponse | null>(null);

  const selectedPlan = getSelectedPlan();
  const plan = selectedPlan ? PLANS.find((p) => p.id === selectedPlan) : null;

  const { data: publicConfig, isLoading: configLoading } = usePublicPaymentConfig();
  const createMercadoPagoPayment = useCreateMercadoPagoPayment();
  const { data: paymentStatus, isLoading: statusLoading, refetch: refetchStatus } = useCheckPaymentStatus(paymentData?.paymentId || null);
  const confirmPayment = useConfirmPaymentAndUpgrade();

  // Handle return from Mercado Pago (resume checkout flow)
  useEffect(() => {
    const paymentIdFromUrl = searchParams.payment_id;
    if (paymentIdFromUrl && !paymentData) {
      // Resume checkout with payment ID from URL
      setPaymentData({
        paymentId: paymentIdFromUrl,
        checkoutUrl: undefined,
        pixInstructions: undefined,
      });
    }
  }, [searchParams.payment_id]);

  useEffect(() => {
    if (!selectedPlan && !searchParams.payment_id) {
      navigate({ to: '/planos' });
    }
  }, [selectedPlan, searchParams.payment_id, navigate]);

  useEffect(() => {
    if (paymentStatus === 'approved' && !confirmPayment.isPending) {
      handlePaymentApproved();
    }
  }, [paymentStatus]);

  const handlePaymentApproved = async () => {
    if (!paymentData?.paymentId) return;

    try {
      await confirmPayment.mutateAsync({
        paymentId: paymentData.paymentId,
        status: 'approved',
      });
      toast.success('Payment confirmed! Your subscription has been upgraded.');
      clearSelectedPlan();
      navigate({ to: '/planos' });
    } catch (error: any) {
      toast.error(error || 'Failed to confirm payment');
    }
  };

  const handleMercadoPagoCheckout = async () => {
    if (!plan) return;

    try {
      const planId = plan.id as SubscriptionPlan;
      const response = await createMercadoPagoPayment.mutateAsync(planId);

      setPaymentData(response);

      if (response.checkoutUrl) {
        toast.success('Redirecting to Mercado Pago...');
        // Add payment_id to return URL for resume flow
        const returnUrl = `${window.location.origin}/checkout?payment_id=${response.paymentId}`;
        window.location.href = response.checkoutUrl;
      } else {
        toast.info('Payment preference created. Awaiting payment confirmation.');
      }
    } catch (error: any) {
      toast.error(error || 'Failed to create payment');
    }
  };

  const handleRefreshStatus = () => {
    refetchStatus();
  };

  if (!plan && !searchParams.payment_id) {
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

  const mercadoPagoEnabled = publicConfig?.mercadoPago?.enabled || false;

  // Convert PaymentStatus to PaymentStatusResponse for the panel
  const statusResponse: PaymentStatusResponse | null = paymentData && paymentStatus ? {
    paymentId: paymentData.paymentId,
    status: paymentStatus,
    statusDetail: undefined,
  } : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        <p className="text-muted-foreground">Complete your subscription purchase</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {plan && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Plan</CardTitle>
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
          )}

          {paymentData && statusResponse ? (
            <PaymentStatusPanel
              status={statusResponse}
              isLoading={statusLoading}
              onRefresh={handleRefreshStatus}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose how you want to pay</CardDescription>
              </CardHeader>
              <CardContent>
                {!mercadoPagoEnabled ? (
                  <PaymentProviderNotConfigured 
                    providerName="mercadopago" 
                    providerDisplayName="Mercado Pago" 
                  />
                ) : (
                  <Tabs defaultValue="mercadopago" className="w-full">
                    <TabsList className="grid w-full grid-cols-1">
                      <TabsTrigger value="mercadopago">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Mercado Pago
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="mercadopago" className="space-y-4">
                      <Alert>
                        <QrCode className="h-4 w-4" />
                        <AlertDescription>
                          Pay with PIX, credit card, or other methods via Mercado Pago
                        </AlertDescription>
                      </Alert>

                      {paymentData && (
                        <MercadoPagoNextSteps paymentData={paymentData} />
                      )}

                      <Button
                        onClick={handleMercadoPagoCheckout}
                        disabled={createMercadoPagoPayment.isPending || !!paymentData}
                        className="w-full"
                        size="lg"
                      >
                        {createMercadoPagoPayment.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : paymentData ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Payment Created
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 mr-2" />
                            Continue to Mercado Pago
                          </>
                        )}
                      </Button>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {plan && (
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium">{plan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billing</span>
                  <span className="font-medium">{plan.billingPeriod}</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold">{plan.price}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <TrustBadges />
        </div>
      </div>
    </div>
  );
}
