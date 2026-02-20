import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Check, QrCode as QrCodeIcon, AlertCircle } from 'lucide-react';
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

  useEffect(() => {
    const loadQRCode = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Generate PIX payload
        const payload = generateFixedPixPayload();
        console.log('PIX Payload generated:', payload);
        setPixPayload(payload);

        // Generate QR code image from payload
        const dataUrl = await generateQRCodeDataURL(payload, 300);
        console.log('QR Code generated successfully');
        setQrCodeDataUrl(dataUrl);
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Erro ao gerar QR Code. Por favor, recarregue a página e tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCodeIcon className="h-5 w-5" />
          Pagamento via PIX
        </CardTitle>
        <CardDescription>
          Escaneie o QR Code ou copie a chave PIX para realizar o pagamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR Code Display */}
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <div className="w-[300px] h-[300px] bg-muted animate-pulse rounded-lg flex items-center justify-center">
              <QrCodeIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="w-[300px] h-[300px] bg-muted rounded-lg flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          ) : qrCodeDataUrl ? (
            <div className="bg-white p-4 rounded-lg border-2 border-border shadow-sm">
              <img
                src={qrCodeDataUrl}
                alt="PIX QR Code"
                className="w-[300px] h-[300px]"
                onError={() => setError('Erro ao carregar QR Code')}
              />
            </div>
          ) : null}

          {!error && !isLoading && (
            <Alert>
              <AlertDescription className="text-center">
                Escaneie este QR Code com o app do seu banco para pagar
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* PIX Key Display */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Chave PIX (Email)
            </label>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 p-3 bg-muted rounded-md font-mono text-sm break-all">
                {pixKey}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyPixKey}
                title="Copiar chave PIX"
              >
                {copiedKey ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Copy Payload Button */}
          {pixPayload && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleCopyPayload}
              disabled={!pixPayload}
            >
              {copiedPayload ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  Código PIX Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Código PIX (Pix Copia e Cola)
                </>
              )}
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Como pagar:</p>
          <ol className="list-decimal list-inside space-y-1 ml-2">
            <li>Abra o app do seu banco</li>
            <li>Escolha a opção "Pagar com PIX"</li>
            <li>Escaneie o QR Code acima OU copie a chave PIX</li>
            <li>Confirme o pagamento no app do seu banco</li>
          </ol>
          <Alert className="mt-4">
            <AlertDescription>
              <strong>Importante:</strong> Após realizar o pagamento, aguarde alguns instantes.
              Sua assinatura será ativada automaticamente.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
