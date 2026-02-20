import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useGetPagBankTransparentCheckoutConfig, useSetPagBankTransparentCheckoutConfig } from '../../hooks/usePagBankTransparentCheckout';
import { useGetPagBankReturnWebhookUrls, useSetPagBankReturnWebhookUrls } from '../../hooks/usePagBankReturnWebhookUrls';
import { PagBankTransparentCheckoutConfig } from '../../backend';
import { toast } from 'sonner';
import PagBankWebhookUrlDisplay from './PagBankWebhookUrlDisplay';

const PAYMENT_TYPES = [
  { id: 'credit_card', label: 'Cartão de Crédito' },
  { id: 'debit_card', label: 'Cartão de Débito' },
  { id: 'pix', label: 'PIX' },
  { id: 'boleto', label: 'Boleto' },
];

export default function PagBankTransparentCheckoutForm() {
  const { data: config, isLoading: configLoading } = useGetPagBankTransparentCheckoutConfig();
  const { data: urlsConfig, isLoading: urlsLoading } = useGetPagBankReturnWebhookUrls();
  const setConfig = useSetPagBankTransparentCheckoutConfig();
  const setUrls = useSetPagBankReturnWebhookUrls();

  const [formData, setFormData] = useState<PagBankTransparentCheckoutConfig>({
    token: '',
    email: '',
    publicKey: '',
    acceptedPaymentTypes: [],
    maxInstallments: BigInt(12),
    interestRate: undefined,
  });

  const [returnUrl, setReturnUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  useEffect(() => {
    if (urlsConfig) {
      setReturnUrl(urlsConfig.returnUrl);
    }
  }, [urlsConfig]);

  const handlePaymentTypeToggle = (typeId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      acceptedPaymentTypes: checked
        ? [...prev.acceptedPaymentTypes, typeId]
        : prev.acceptedPaymentTypes.filter((t) => t !== typeId),
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.token.trim()) {
      return 'Token é obrigatório';
    }
    if (!formData.email.trim()) {
      return 'Email é obrigatório';
    }
    if (!formData.publicKey.trim()) {
      return 'Public Key é obrigatória';
    }
    if (formData.acceptedPaymentTypes.length === 0) {
      return 'Selecione pelo menos um tipo de pagamento';
    }
    if (formData.maxInstallments < BigInt(1)) {
      return 'Número máximo de parcelas deve ser pelo menos 1';
    }
    if (returnUrl && !returnUrl.startsWith('https://')) {
      return 'URL de retorno deve começar com https://';
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Save transparent checkout config
      await setConfig.mutateAsync(formData);

      // Save return/webhook URLs if returnUrl is provided
      if (returnUrl.trim()) {
        await setUrls.mutateAsync({
          returnUrl: returnUrl.trim(),
          webhookUrl: '', // Backend will generate this
        });
      }

      setSaveSuccess(true);
      toast.success('Configuração do checkout transparente salva com sucesso');

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Falha ao salvar configuração');
    } finally {
      setIsSaving(false);
    }
  };

  if (configLoading || urlsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Credenciais do Checkout Transparente</CardTitle>
          <CardDescription>Configure as credenciais de API do PagBank para checkout transparente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              O checkout transparente permite processar pagamentos diretamente no seu aplicativo sem redirecionar para o PagBank.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Token (Produção ou Sandbox) *</Label>
              <Input
                id="token"
                type="password"
                placeholder="Digite o token do PagBank"
                value={formData.token}
                onChange={(e) => setFormData({ ...formData, token: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Use o token de sandbox para testes e o token de produção para pagamentos reais
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email da Conta PagBank *</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu-email@exemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publicKey">Public Key *</Label>
              <Input
                id="publicKey"
                type="text"
                placeholder="Digite a chave pública"
                value={formData.publicKey}
                onChange={(e) => setFormData({ ...formData, publicKey: e.target.value })}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Tipos de Pagamento Aceitos *</Label>
              <div className="space-y-2">
                {PAYMENT_TYPES.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.id}
                      checked={formData.acceptedPaymentTypes.includes(type.id)}
                      onCheckedChange={(checked) => handlePaymentTypeToggle(type.id, checked as boolean)}
                    />
                    <Label htmlFor={type.id} className="font-normal cursor-pointer">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxInstallments">Número Máximo de Parcelas *</Label>
              <Input
                id="maxInstallments"
                type="number"
                min="1"
                max="24"
                value={Number(formData.maxInstallments)}
                onChange={(e) =>
                  setFormData({ ...formData, maxInstallments: BigInt(Math.max(1, parseInt(e.target.value) || 1)) })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Taxa de Juros (%) - Opcional</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 2.5"
                value={formData.interestRate ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    interestRate: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Taxa de juros mensal para parcelamento (deixe vazio para sem juros)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <PagBankWebhookUrlDisplay
        returnUrl={returnUrl}
        onReturnUrlChange={setReturnUrl}
        disabled={isSaving}
      />

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={isSaving} className="min-w-[120px]">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar Configuração
            </>
          )}
        </Button>

        {saveSuccess && (
          <div className="flex items-center text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Salvo com sucesso
          </div>
        )}
      </div>
    </div>
  );
}
