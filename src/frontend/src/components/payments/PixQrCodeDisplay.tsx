import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, QrCode as QrCodeIcon, AlertCircle, Zap, RefreshCw } from 'lucide-react';
import { generateFixedPixPayload } from '@/lib/payments/pixPayload';
import { generateQRCodeDataURL } from '@/lib/payments/qrCodeGenerator';

interface PixQrCodeDisplayProps {
  amount?: number;
  description?: string;
}

export default function PixQrCodeDisplay({ amount, description }: PixQrCodeDisplayProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [pixPayload, setPixPayload] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pixKey = 'proj.defdriver+pagbank@gmail.com';

  const loadQRCode = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate PIX payload
      const payload = generateFixedPixPayload();
      console.log('PIX Payload generated:', payload);
      
      if (!payload || payload.trim().length === 0) {
        throw new Error('Invalid PIX payload generated');
      }
      
      setPixPayload(payload);

      // Generate QR code image from payload
      const dataUrl = await generateQRCodeDataURL(payload, 280);
      console.log('QR Code generated successfully');
      setQrCodeDataUrl(dataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Erro ao gerar QR Code: ${errorMessage}. Por favor, tente novamente.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQRCode();
  }, [amount, description]);

  const handleCopyPixKey = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } catch (err) {
      console.error('Failed to copy PIX key:', err);
    }
  };

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    } catch (err) {
      console.error('Failed to copy payload:', err);
    }
  };

  const handleRetry = () => {
    loadQRCode();
  };

  return (
    <Card className="border-2 border-primary shadow-2xl bg-gradient-to-br from-card via-card to-primary/5">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className="bg-primary text-primary-foreground px-3 py-1">
            <Zap className="h-3 w-3 mr-1" />
            Pagamento Instantâneo
          </Badge>
        </div>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <QrCodeIcon className="h-6 w-6 text-primary" />
          Pagar com PIX
        </CardTitle>
        <CardDescription className="text-base">
          Escaneie o QR Code ou copie a chave PIX
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR Code Display - Prominent */}
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <div className="w-[280px] h-[280px] bg-muted animate-pulse rounded-xl flex items-center justify-center border-4 border-primary/20">
              <QrCodeIcon className="h-16 w-16 text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="w-[280px] min-h-[280px] bg-muted rounded-xl flex flex-col items-center justify-center p-6 text-center border-4 border-destructive/20">
              <AlertCircle className="h-16 w-16 text-destructive mb-4" />
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="mt-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          ) : qrCodeDataUrl ? (
            <div className="bg-white p-5 rounded-xl border-4 border-primary shadow-xl hover:shadow-2xl transition-shadow">
              <img
                src={qrCodeDataUrl}
                alt="PIX QR Code"
                className="w-[280px] h-[280px]"
                onError={() => setError('Erro ao carregar QR Code')}
              />
            </div>
          ) : null}

          {!error && !isLoading && (
            <Alert className="bg-primary/10 border-primary/30">
              <AlertDescription className="text-center font-medium">
                📱 Abra o app do seu banco e escaneie o código
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* PIX Key Display - Enhanced */}
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border">
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">
              Chave PIX (Email)
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-background rounded-md font-mono text-sm break-all border border-border">
                {pixKey}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyPixKey}
                title="Copiar chave PIX"
                className="shrink-0"
              >
                {copiedKey ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Copy Payload Button - Prominent */}
          {pixPayload && (
            <Button
              variant="default"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={handleCopyPayload}
              disabled={!pixPayload}
              size="lg"
            >
              {copiedPayload ? (
                <>
                  <Check className="h-5 w-5 mr-2 text-primary-foreground" />
                  Código PIX Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5 mr-2" />
                  Copiar Código PIX (Pix Copia e Cola)
                </>
              )}
            </Button>
          )}
        </div>

        {/* Instructions - Clear and Concise */}
        <div className="space-y-3 text-sm">
          <p className="font-semibold text-foreground text-base">Como pagar:</p>
          <ol className="space-y-2 ml-1">
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                1
              </span>
              <span className="text-muted-foreground pt-0.5">Abra o app do seu banco</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                2
              </span>
              <span className="text-muted-foreground pt-0.5">Escolha "Pagar com PIX"</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                3
              </span>
              <span className="text-muted-foreground pt-0.5">Escaneie o QR Code ou cole o código PIX</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                4
              </span>
              <span className="text-muted-foreground pt-0.5">Confirme o pagamento</span>
            </li>
          </ol>
          <Alert className="mt-4 bg-success/10 border-success/30">
            <Check className="h-4 w-4 text-success" />
            <AlertDescription className="text-success-foreground">
              <strong>Ativação automática!</strong> Sua assinatura será ativada em instantes após o pagamento.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
