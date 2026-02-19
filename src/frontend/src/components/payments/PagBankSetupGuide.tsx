import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, AlertTriangle, ExternalLink, Code, Shield, TestTube } from 'lucide-react';

export default function PagBankSetupGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Guia de Integração PagBank
        </CardTitle>
        <CardDescription>
          Siga os passos abaixo para configurar o PagBank como provedor de pagamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Security Warning */}
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Importante:</strong> Nunca compartilhe suas credenciais de API. Mantenha o Client Secret e Webhook Secret seguros.
          </AlertDescription>
        </Alert>

        {/* Step 1: Create Account */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="h-6 w-6 rounded-full flex items-center justify-center p-0">
              1
            </Badge>
            <h3 className="font-semibold text-lg">Criar Conta PagBank</h3>
          </div>
          <p className="text-sm text-muted-foreground ml-8">
            Acesse{' '}
            <a
              href="https://pagseguro.uol.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              PagBank/PagSeguro
              <ExternalLink className="h-3 w-3" />
            </a>{' '}
            e crie uma conta empresarial. Você precisará fornecer informações da sua empresa e documentação.
          </p>
        </div>

        <Separator />

        {/* Step 2: Access Developer Dashboard */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="h-6 w-6 rounded-full flex items-center justify-center p-0">
              2
            </Badge>
            <h3 className="font-semibold text-lg">Acessar Painel de Desenvolvedor</h3>
          </div>
          <p className="text-sm text-muted-foreground ml-8">
            Faça login na sua conta PagBank e acesse o{' '}
            <a
              href="https://dev.pagseguro.uol.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Painel de Desenvolvedor
              <ExternalLink className="h-3 w-3" />
            </a>
            . Aqui você encontrará suas credenciais de API.
          </p>
        </div>

        <Separator />

        {/* Step 3: Generate API Credentials */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="h-6 w-6 rounded-full flex items-center justify-center p-0">
              3
            </Badge>
            <h3 className="font-semibold text-lg">Gerar Credenciais de API</h3>
          </div>
          <div className="ml-8 space-y-2">
            <p className="text-sm text-muted-foreground">
              No painel de desenvolvedor, gere as seguintes credenciais:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li><strong>Client ID:</strong> Identificador da sua aplicação</li>
              <li><strong>Client Secret:</strong> Chave secreta para autenticação</li>
              <li><strong>Merchant ID:</strong> Identificador da sua conta de vendedor</li>
              <li><strong>Webhook Secret:</strong> Chave para validar notificações de webhook</li>
            </ul>
          </div>
        </div>

        <Separator />

        {/* Step 4: Configure Webhook */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="h-6 w-6 rounded-full flex items-center justify-center p-0">
              4
            </Badge>
            <h3 className="font-semibold text-lg">Configurar Webhook</h3>
          </div>
          <div className="ml-8 space-y-3">
            <p className="text-sm text-muted-foreground">
              Configure a URL do webhook no painel PagBank para receber notificações de pagamento:
            </p>
            <div className="bg-muted p-3 rounded-md">
              <code className="text-xs break-all">
                https://&lt;canister-id&gt;.icp0.io/pagbank-webhook
              </code>
            </div>
            <Alert>
              <Code className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Substitua <code>&lt;canister-id&gt;</code> pelo ID do seu canister backend. O webhook receberá notificações sobre mudanças no status dos pagamentos.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <Separator />

        {/* Step 5: Test in Sandbox */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="h-6 w-6 rounded-full flex items-center justify-center p-0">
              5
            </Badge>
            <h3 className="font-semibold text-lg">Testar em Modo Sandbox</h3>
          </div>
          <div className="ml-8 space-y-3">
            <p className="text-sm text-muted-foreground">
              Antes de ativar em produção, teste a integração usando o ambiente sandbox do PagBank:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Use credenciais de sandbox fornecidas pelo PagBank</li>
              <li>Realize transações de teste com cartões de teste</li>
              <li>Verifique se os webhooks estão sendo recebidos corretamente</li>
              <li>Confirme que as assinaturas são ativadas após pagamento aprovado</li>
            </ul>
          </div>
        </div>

        <Separator />

        {/* Step 6: Switch to Production */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="default" className="h-6 w-6 rounded-full flex items-center justify-center p-0">
              6
            </Badge>
            <h3 className="font-semibold text-lg">Ativar em Produção</h3>
          </div>
          <div className="ml-8 space-y-3">
            <p className="text-sm text-muted-foreground">
              Após validar todos os testes, substitua as credenciais de sandbox pelas credenciais de produção:
            </p>
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Checklist de Pré-Produção:</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Todas as transações de teste foram bem-sucedidas</li>
                  <li>Webhooks estão funcionando corretamente</li>
                  <li>Credenciais de produção foram obtidas</li>
                  <li>URL do webhook foi atualizada para produção</li>
                  <li>Documentação de segurança foi revisada</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <Separator />

        {/* Additional Resources */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Recursos Adicionais</h3>
          <div className="space-y-2">
            <a
              href="https://dev.pagseguro.uol.com.br/reference/api-de-pagamentos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Documentação da API PagBank
            </a>
            <a
              href="https://dev.pagseguro.uol.com.br/reference/webhooks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Guia de Webhooks
            </a>
            <a
              href="https://dev.pagseguro.uol.com.br/reference/ambiente-de-testes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <TestTube className="h-3 w-3" />
              Ambiente de Testes (Sandbox)
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
