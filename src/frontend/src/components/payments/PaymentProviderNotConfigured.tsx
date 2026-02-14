import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, Settings } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useIsAdmin } from '@/hooks/useIsAdmin';

interface PaymentProviderNotConfiguredProps {
  providerName: string;
  providerDisplayName: string;
}

/**
 * Reusable UI component for "payment provider not configured" state
 * Shows appropriate messaging and actions based on user role
 */
export default function PaymentProviderNotConfigured({
  providerName,
  providerDisplayName,
}: PaymentProviderNotConfiguredProps) {
  const navigate = useNavigate();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  const handleAdminAction = () => {
    navigate({ to: '/admin' });
  };

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>{providerDisplayName} is not configured.</strong>
          <p className="mt-2">
            {isAdmin
              ? 'As an administrator, you need to configure the payment provider credentials before payments can be processed.'
              : 'The payment provider has not been set up yet. Please contact an administrator or try again later.'}
          </p>
        </AlertDescription>
      </Alert>

      {!isAdminLoading && isAdmin && (
        <Button
          onClick={handleAdminAction}
          className="w-full"
          size="lg"
          variant="default"
        >
          <Settings className="h-4 w-4 mr-2" />
          Go to Admin Dashboard
        </Button>
      )}

      {!isAdminLoading && !isAdmin && (
        <Alert>
          <AlertDescription>
            <strong>Need help?</strong>
            <p className="mt-2">
              Please contact your system administrator to enable payment processing. 
              They will need to configure the {providerDisplayName} credentials in the Admin Dashboard.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
