import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface AdminGateProps {
  children: React.ReactNode;
}

export default function AdminGate({ children }: AdminGateProps) {
  const { identity, loginStatus } = useInternetIdentity();
  const { isAdmin, isLoading } = useIsAdmin();
  const navigate = useNavigate();

  // Not authenticated
  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-destructive" />
              Restricted Access
            </CardTitle>
            <CardDescription>
              You must be authenticated to access this area.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/' })} className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading admin status
  if (isLoading || loginStatus === 'logging-in') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-destructive" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You do not have permission to access this administrative area.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                This area is restricted to system administrators only.
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate({ to: '/' })} className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin - render children
  return <>{children}</>;
}
