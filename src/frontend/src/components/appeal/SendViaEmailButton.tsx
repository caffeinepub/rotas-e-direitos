import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Platform } from '../../backend';
import { createAppealMailto } from '../../lib/mailto';
import { Mail, Info } from 'lucide-react';

interface SendViaEmailButtonProps {
  platform: Platform;
  appealText: string;
}

export default function SendViaEmailButton({ platform, appealText }: SendViaEmailButtonProps) {
  const handleSend = () => {
    const subject = `Recurso de Reativação - ${platform}`;
    const mailtoLink = createAppealMailto(platform, subject, appealText);
    window.location.href = mailtoLink;
  };

  return (
    <div className="flex-1 space-y-4">
      <Button onClick={handleSend} size="lg" className="w-full">
        <Mail className="mr-2 h-4 w-4" />
        Enviar por E-mail
      </Button>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>Importante:</strong> Após abrir seu cliente de e-mail, você precisará anexar manualmente as
          evidências (ZIP) e o relatório de perdas (PDF) que você baixou anteriormente. Navegadores não podem
          anexar arquivos automaticamente por segurança.
        </AlertDescription>
      </Alert>
    </div>
  );
}
