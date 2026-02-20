import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, CheckCircle2, AlertTriangle, Info, Shield } from 'lucide-react';
import { generateWebhookUrl } from '../../lib/canisterConfig';

export default function PagBankSetupGuide() {
  const webhookUrl = generateWebhookUrl();

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5" />
          Guia de Configuração do PagBank
        </CardTitle>
        <CardDescription>
          Siga estas etapas para configurar a integração com o PagBank
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* SSL/HTTPS Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>SSL/HTTPS:</strong> O Internet Computer fornece automaticamente certificados SSL para todos os canisters. Sua aplicação já está protegida com HTTPS.
          </AlertDescription>
        </Alert>

        {/* Step 1: Account Setup */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="rounded-full w-6 h-6 flex items-center justify-center p-0">1</Badge>
            <h3 className="font-semibold text-base">Criar Conta PagBank</h3>
          </div>
          <div className="ml-8 space-y-2">
            <p className="text-sm text-muted-foreground">
              Se você ainda não tem uma conta PagBank, crie uma em:
            </p>
            <a
              href="https://pagseguro.uol.com.br/registration/registration.jhtml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Criar conta PagBank
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <Separator />

        {/* Step 2: API Credentials */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="rounded-full w-6 h-6 flex items-center justify-center p-0">2</Badge>
            <h3 className="font-semibold text-base">Obter Credenciais de API</h3>
          </div>
          <div className="ml-8 space-y-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">Para Checkout Padrão:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-2">
                <li>Acesse o painel do PagBank</li>
                <li>Navegue até <strong>Integrações → Credenciais</strong></li>
                <li>Copie o <strong>Client ID</strong>, <strong>Client Secret</strong>, <strong>Merchant ID</strong></li>
                <li>Gere um <strong>Webhook Secret</strong> para validação de notificações</li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Para Checkout Transparente:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-2">
                <li>No painel do PagBank, vá para <strong>Integrações → Checkout Transparente</strong></li>
                <li>Copie o <strong>Token</strong> (use sandbox para testes, produção para pagamentos reais)</li>
                <li>Copie o <strong>Email</strong> da sua conta PagBank</li>
                <li>Copie a <strong>Public Key</strong> (chave pública)</li>
              </ol>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Sandbox vs Produção:</strong> Use credenciais de sandbox durante o desenvolvimento e testes. Troque para credenciais de produção apenas quando estiver pronto para processar pagamentos reais.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <Separator />

        {/* Step 3: Webhook Configuration */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="rounded-full w-6 h-6 flex items-center justify-center p-0">3</Badge>
            <h3 className="font-semibold text-base">Configurar Webhook</h3>
          </div>
          <div className="ml-8 space-y-2">
            <p className="text-sm text-muted-foreground">
              Configure o webhook no painel do PagBank para receber notificações de status de pagamento:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-2">
              <li>No painel do PagBank, vá para <strong>Integrações → Notificações</strong></li>
              <li>Clique em <strong>Adicionar URL de Notificação</strong></li>
              <li>Cole a URL do webhook gerada automaticamente (veja abaixo)</li>
              <li>Selecione os eventos: <strong>Pagamento Aprovado</strong>, <strong>Pagamento Recusado</strong>, <strong>Pagamento Cancelado</strong></li>
              <li>Salve a configuração</li>
            </ol>
            <div className="mt-3 p-3 bg-muted rounded-md">
              <p className="text-xs font-medium mb-1">URL do Webhook (gerada automaticamente):</p>
              <code className="text-xs break-all">{webhookUrl}</code>
            </div>
          </div>
        </div>

        <Separator />

        {/* Step 4: Testing */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="rounded-full w-6 h-6 flex items-center justify-center p-0">4</Badge>
            <h3 className="font-semibold text-base">Testar Integração (Sandbox)</h3>
          </div>
          <div className="ml-8 space-y-2">
            <p className="text-sm text-muted-foreground">
              Use o ambiente sandbox para testar pagamentos sem cobranças reais:
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>
                <p className="font-medium">Cartões de Teste:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li><strong>Aprovado:</strong> 4111 1111 1111 1111</li>
                  <li><strong>Recusado:</strong> 4000 0000 0000 0002</li>
                  <li>CVV: qualquer 3 dígitos | Validade: qualquer data futura</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">PIX de Teste:</p>
                <p className="ml-2">O QR Code gerado no sandbox pode ser "pago" através do painel de testes do PagBank</p>
              </div>
            </div>
            <a
              href="https://dev.pagseguro.uol.com.br/reference/testing-intro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Ver documentação de testes
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <Separator />

        {/* Step 5: Production */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="rounded-full w-6 h-6 flex items-center justify-center p-0">5</Badge>
            <h3 className="font-semibold text-base">Ativar Produção</h3>
          </div>
          <div className="ml-8 space-y-2">
            <p className="text-sm text-muted-foreground">
              Quando estiver pronto para processar pagamentos reais:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-2">
              <li>Substitua as credenciais de sandbox pelas credenciais de produção</li>
              <li>Verifique se o webhook está configurado no ambiente de produção</li>
              <li>Teste com um pagamento real de valor baixo</li>
              <li>Monitore os logs de webhook para confirmar que as notificações estão sendo recebidas</li>
            </ol>
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Dica:</strong> Mantenha as credenciais de sandbox salvas em um local seguro para poder voltar ao modo de teste quando necessário.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <Separator />

        {/* Additional Resources */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Recursos Adicionais</h3>
          <div className="space-y-1">
            <a
              href="https://dev.pagseguro.uol.com.br/reference/intro-checkout-transparente"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Documentação do Checkout Transparente
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://dev.pagseguro.uol.com.br/reference/webhooks-intro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Documentação de Webhooks
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://faq.pagseguro.uol.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              FAQ do PagBank
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
