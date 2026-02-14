import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { PaymentStatusResponse } from '../../types/mercadopago';

interface PaymentStatusPanelProps {
  status: PaymentStatusResponse | null;
  isLoading: boolean;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function PaymentStatusPanel({ 
  status, 
  isLoading, 
  onRefresh,
  isRefreshing = false 
}: PaymentStatusPanelProps) {
  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="h-5 w-5 animate-spin" />;
    
    switch (status?.status) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
      case 'in_process':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    if (isLoading) {
      return <Badge variant="outline">Checking...</Badge>;
    }

    switch (status?.status) {
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-yellow-600 text-yellow-600">Pending</Badge>;
      case 'in_process':
        return <Badge variant="outline" className="border-blue-600 text-blue-600">Processing</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusMessage = () => {
    if (isLoading) {
      return 'Checking payment status...';
    }

    switch (status?.status) {
      case 'approved':
        return 'Payment approved! Your subscription will be activated shortly.';
      case 'rejected':
        return 'Payment was rejected. Please try again or use a different payment method.';
      case 'cancelled':
        return 'Payment was cancelled. You can start a new payment if needed.';
      case 'pending':
        return 'Payment is pending. Please complete the payment to activate your subscription.';
      case 'in_process':
        return 'Payment is being processed. This may take a few moments.';
      case 'error':
        return status?.statusDetail || 'An error occurred while processing your payment.';
      default:
        return 'Unable to determine payment status. Please refresh to check again.';
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        {getStatusIcon()}
        <AlertDescription className="ml-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">Payment Status:</span>
                {getStatusBadge()}
              </div>
              <p className="text-sm">{getStatusMessage()}</p>
              {status?.statusDetail && status.status !== 'error' && (
                <p className="text-xs text-muted-foreground mt-1">
                  Details: {status.statusDetail}
                </p>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <Button
        onClick={onRefresh}
        disabled={isLoading || isRefreshing}
        variant="outline"
        className="w-full"
      >
        {isRefreshing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Refreshing...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 mr-2" />
            Check Payment Status
          </>
        )}
      </Button>
    </div>
  );
}
