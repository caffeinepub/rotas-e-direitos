import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { PaymentFlowStatus } from '../../hooks/useGatewayPayment';

interface PaymentStatusPanelProps {
  flowStatus: PaymentFlowStatus;
  onRetry?: () => void;
  onCheckStatus?: () => void;
  isCheckingStatus?: boolean;
}

export default function PaymentStatusPanel({ 
  flowStatus, 
  onRetry, 
  onCheckStatus,
  isCheckingStatus = false 
}: PaymentStatusPanelProps) {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate({ to: '/' });
  };

  const handleGoToPlans = () => {
    navigate({ to: '/planos' });
  };

  // Pending state
  if (flowStatus.state === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Processando Pagamento
          </CardTitle>
          <CardDescription>Aguarde enquanto processamos seu pagamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Seu pagamento está sendo processado. Isso pode levar alguns instantes.
            </AlertDescription>
          </Alert>

          {flowStatus.paymentId && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">ID do Pagamento:</span> {flowStatus.paymentId}
            </div>
          )}

          {onCheckStatus && (
            <Button 
              onClick={onCheckStatus} 
              disabled={isCheckingStatus}
              variant="outline"
              className="w-full"
            >
              {isCheckingStatus ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Verificar Status'
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Completed state
  if (flowStatus.state === 'completed') {
    return (
      <Card className="border-green-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            Pagamento Aprovado!
          </CardTitle>
          <CardDescription>Sua assinatura foi ativada com sucesso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Parabéns! Seu pagamento foi confirmado e sua assinatura Pro está ativa.
            </AlertDescription>
          </Alert>

          {flowStatus.paymentId && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">ID do Pagamento:</span> {flowStatus.paymentId}
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleGoToDashboard} className="flex-1">
              Ir para Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Failed state
  if (flowStatus.state === 'failed') {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Falha no Pagamento
          </CardTitle>
          <CardDescription>Não foi possível processar seu pagamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {flowStatus.error || 'Ocorreu um erro ao processar seu pagamento. Tente novamente.'}
            </AlertDescription>
          </Alert>

          {flowStatus.paymentId && (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">ID do Pagamento:</span> {flowStatus.paymentId}
            </div>
          )}

          <div className="flex gap-2">
            {onRetry && (
              <Button onClick={onRetry} variant="default" className="flex-1">
                Tentar Novamente
              </Button>
            )}
            <Button onClick={handleGoToPlans} variant="outline" className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Planos
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Initiating state
  if (flowStatus.state === 'initiating') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Iniciando Pagamento
          </CardTitle>
          <CardDescription>Preparando sua sessão de pagamento</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Aguarde enquanto preparamos seu pagamento...
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Idle state (no payment in progress)
  return null;
}
