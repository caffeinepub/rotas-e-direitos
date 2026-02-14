import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useEntitlement } from '../../hooks/useSubscription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FeatureGateProps {
  children: ReactNode;
  requirePro?: boolean;
}

export default function FeatureGate({ children, requirePro = false }: FeatureGateProps) {
  const entitlement = useEntitlement();
  const navigate = useNavigate();

  if (!entitlement) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Carregando status da assinatura...</div>
      </div>
    );
  }

  const isAllowed = requirePro ? entitlement.isPro && entitlement.isEntitled : entitlement.isEntitled;

  if (isAllowed) {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-2xl w-full border-2 border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl">
            {entitlement.isExpired ? 'Assinatura Expirada' : 'Recurso Bloqueado'}
          </CardTitle>
          <CardDescription className="text-lg">
            {entitlement.isExpired
              ? `Sua ${entitlement.planName} expirou. Renove para continuar acessando todos os recursos.`
              : requirePro
              ? 'Este recurso está disponível apenas para assinantes Pro.'
              : 'Você precisa de uma assinatura ativa para acessar este recurso.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-accent">
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              Desbloqueie acesso ilimitado a todas as ferramentas para defender seus direitos como entregador.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => navigate({ to: '/planos' })} className="text-lg">
              Ver Planos e Preços
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate({ to: '/' })}>
              Voltar ao Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
