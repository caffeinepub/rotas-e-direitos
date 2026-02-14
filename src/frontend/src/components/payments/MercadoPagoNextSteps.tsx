import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Copy, QrCode } from 'lucide-react';
import { MercadoPagoPaymentResponse } from '../../types/mercadopago';
import { toast } from 'sonner';

interface MercadoPagoNextStepsProps {
  paymentData: MercadoPagoPaymentResponse;
}

export default function MercadoPagoNextSteps({ paymentData }: MercadoPagoNextStepsProps) {
  const handleCopyPixCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success('PIX code copied to clipboard');
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const hasCheckoutUrl = !!paymentData.checkoutUrl;
  const hasPixInstructions = !!paymentData.pixInstructions;
  const pixInstructions = paymentData.pixInstructions;

  return (
    <div className="space-y-4">
      <Alert>
        <QrCode className="h-4 w-4" />
        <AlertDescription>
          <p className="font-medium mb-2">Complete your payment</p>
          <p className="text-sm text-muted-foreground">
            {hasCheckoutUrl && 'Click the button below to complete your payment on Mercado Pago\'s secure checkout page.'}
            {hasPixInstructions && !hasCheckoutUrl && 'Scan the QR code or copy the PIX code to complete your payment.'}
            {!hasCheckoutUrl && !hasPixInstructions && 'Your payment is being processed. Please wait for confirmation.'}
          </p>
        </AlertDescription>
      </Alert>

      {/* Checkout URL Button */}
      {hasCheckoutUrl && (
        <Button
          className="w-full"
          size="lg"
          onClick={() => window.open(paymentData.checkoutUrl, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open Mercado Pago Checkout
        </Button>
      )}

      {/* PIX Instructions */}
      {hasPixInstructions && pixInstructions && (
        <div className="space-y-4">
          {/* QR Code Display */}
          {(pixInstructions.qr_code_base64 || pixInstructions.qr_code) && (
            <div className="flex flex-col items-center gap-4 p-6 bg-accent rounded-lg">
              <img
                src={
                  pixInstructions.qr_code_base64
                    ? `data:image/png;base64,${pixInstructions.qr_code_base64}`
                    : pixInstructions.qr_code
                }
                alt="PIX QR Code"
                className="w-64 h-64 rounded-lg border-2 border-border bg-white p-2"
              />
              <p className="text-sm text-muted-foreground text-center">
                Scan this QR code with your banking app to pay
              </p>
            </div>
          )}

          {/* PIX Copy and Paste Code */}
          {pixInstructions.qr_code && (
            <div className="space-y-2">
              <Label htmlFor="pixCode">PIX Copy and Paste</Label>
              <div className="flex gap-2">
                <Input
                  id="pixCode"
                  readOnly
                  value={pixInstructions.qr_code}
                  className="font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopyPixCode(pixInstructions.qr_code)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Copy this code and paste it in your banking app's PIX payment section
              </p>
            </div>
          )}

          {/* Ticket URL (if available) */}
          {pixInstructions.ticket_url && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(pixInstructions.ticket_url, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Payment Details
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
