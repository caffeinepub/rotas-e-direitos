import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check, Info } from 'lucide-react';
import { generateWebhookUrl } from '../../lib/canisterConfig';
import { toast } from 'sonner';

interface PagBankWebhookUrlDisplayProps {
  returnUrl: string;
  onReturnUrlChange: (url: string) => void;
  disabled?: boolean;
}

export default function PagBankWebhookUrlDisplay({
  returnUrl,
  onReturnUrlChange,
  disabled = false,
}: PagBankWebhookUrlDisplayProps) {
  const [copied, setCopied] = useState(false);
  const webhookUrl = generateWebhookUrl();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      toast.success('URL do webhook copiada!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Falha ao copiar URL');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>URLs de Retorno e Webhook</CardTitle>
        <CardDescription>Configure as URLs para redirecionamento e notificações de pagamento</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            A URL do webhook é gerada automaticamente. Copie e registre-a no painel do PagBank para receber notificações de status de pagamento.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="return-url">URL de Retorno (após pagamento)</Label>
          <Input
            id="return-url"
            type="url"
            placeholder="https://seu-app.com/payment/success"
            value={returnUrl}
            onChange={(e) => onReturnUrlChange(e.target.value)}
            disabled={disabled}
          />
          <p className="text-xs text-muted-foreground">
            URL para onde o usuário será redirecionado após concluir o pagamento
          </p>
        </div>

        <div className="space-y-2">
          <Label>URL do Webhook (gerada automaticamente)</Label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={webhookUrl}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
              disabled={disabled}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Registre esta URL no painel do PagBank para receber notificações de webhook
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
