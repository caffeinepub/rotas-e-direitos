import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrCode, CreditCard, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { getSelectedPlan, clearSelectedPlan } from '../lib/payments/checkoutState';
import { getPlanById } from '../lib/subscriptions/plans';
import { useUpgradeSubscription } from '../hooks/useSubscription';
import TrustBadges from '../components/trust/TrustBadges';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [installments, setInstallments] = useState('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const upgradeSubscription = useUpgradeSubscription();

  useEffect(() => {
    const planId = getSelectedPlan();
    if (!planId) {
      navigate({ to: '/planos' });
      return;
    }
    setSelectedPlan(planId);
  }, [navigate]);

  const plan = selectedPlan ? getPlanById(selectedPlan as any) : null;

  const handlePayment = async (method: string) => {
    if (!selectedPlan) return;

    setIsProcessing(true);
    try {
      await upgradeSubscription.mutateAsync(selectedPlan as any);
      toast.success('Assinatura ativada com sucesso!');
      clearSelectedPlan();
      navigate({ to: '/dashboard-planos' });
    } catch (error) {
      toast.error('Erro ao processar pagamento. Tente novamente.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!plan) {
    return null;
  }

  const installmentValue = plan.priceValue / parseInt(installments);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/planos' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finalizar Pagamento</h1>
          <p className="text-muted-foreground">Plano selecionado: {plan.name}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Escolha a Forma de Pagamento</CardTitle>
              <CardDescription>Selecione como deseja pagar sua assinatura</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pix" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pix">
                    <QrCode className="h-4 w-4 mr-2" />
                    PIX
                  </TabsTrigger>
                  <TabsTrigger value="card">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Cartão
                  </TabsTrigger>
                  <TabsTrigger value="boleto">
                    <FileText className="h-4 w-4 mr-2" />
                    Boleto
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pix" className="space-y-4 mt-6">
                  <Alert>
                    <QrCode className="h-4 w-4" />
                    <AlertDescription>
                      Pagamento instantâneo via PIX. Após o pagamento, sua assinatura será ativada automaticamente.
                    </AlertDescription>
                  </Alert>
                  <div className="flex flex-col items-center gap-4 p-6 bg-accent rounded-lg">
                    <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center border-2 border-border">
                      <QrCode className="h-32 w-32 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      QR Code será gerado após a confirmação
                    </p>
                    <Input
                      readOnly
                      value="00020126580014br.gov.bcb.pix..."
                      className="font-mono text-xs"
                    />
                    <Button className="w-full" size="lg" onClick={() => handlePayment('pix')} disabled={isProcessing}>
                      {isProcessing ? 'Processando...' : 'Confirmar Pagamento PIX'}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="card" className="space-y-4 mt-6">
                  <Alert>
                    <CreditCard className="h-4 w-4" />
                    <AlertDescription>
                      Parcele em até 12x sem juros. Pagamento processado de forma segura.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="installments">Número de Parcelas</Label>
                      <Select value={installments} onValueChange={setInstallments}>
                        <SelectTrigger id="installments">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}x de R$ {installmentValue.toFixed(2)} {num === 1 ? '(à vista)' : 'sem juros'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número do Cartão</Label>
                      <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Validade</Label>
                        <Input id="expiry" placeholder="MM/AA" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                    <Button className="w-full" size="lg" onClick={() => handlePayment('card')} disabled={isProcessing}>
                      {isProcessing ? 'Processando...' : `Pagar ${installments}x de R$ ${installmentValue.toFixed(2)}`}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="boleto" className="space-y-4 mt-6">
                  <Alert>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                      Boleto com vencimento em 3 dias úteis. Sua assinatura será ativada após a confirmação do pagamento.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-4 p-6 bg-accent rounded-lg">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Código de Barras</p>
                      <Input
                        readOnly
                        value="34191.79001 01043.510047 91020.150008 1 84560000012345"
                        className="font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Instruções</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Pague em qualquer banco, lotérica ou app bancário</li>
                        <li>• Vencimento: 3 dias úteis após a geração</li>
                        <li>• Confirmação em até 2 dias úteis</li>
                      </ul>
                    </div>
                    <Button className="w-full" size="lg" onClick={() => handlePayment('boleto')} disabled={isProcessing}>
                      {isProcessing ? 'Processando...' : 'Gerar Boleto'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <TrustBadges />
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plano</span>
                  <span className="font-medium">{plan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Período</span>
                  <span className="font-medium">{plan.billingPeriod}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{plan.price}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Acesso imediato após confirmação do pagamento
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Cancele a qualquer momento
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
