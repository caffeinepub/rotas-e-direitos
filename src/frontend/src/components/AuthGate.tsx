import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

interface AuthGateProps {
  children: React.ReactNode;
  message?: string;
}

export default function AuthGate({ children, message }: AuthGateProps) {
  const { identity, login, isLoggingIn } = useInternetIdentity();

  if (!identity) {
    return (
      <Alert className="max-w-2xl mx-auto">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="text-lg">Autenticação Necessária</AlertTitle>
        <AlertDescription className="mt-2 space-y-4">
          <p className="text-base">
            {message || 'Você precisa estar autenticado para acessar esta funcionalidade.'}
          </p>
          <Button onClick={login} disabled={isLoggingIn} size="lg">
            {isLoggingIn ? 'Entrando...' : 'Entrar Agora'}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}
