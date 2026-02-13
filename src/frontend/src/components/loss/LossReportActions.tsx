import { Button } from '@/components/ui/button';
import { PublicLossProfile } from '../../backend';
import { generateLossPDF } from '../../lib/pdfReport';
import { Download, Share2 } from 'lucide-react';

interface LossReportActionsProps {
  profile: PublicLossProfile;
}

export default function LossReportActions({ profile }: LossReportActionsProps) {
  const handleDownload = async () => {
    await generateLossPDF(profile);
  };

  const handleShare = async () => {
    const blob = await generateLossPDF(profile, true);
    if (!blob) return;

    const file = new File([blob], 'relatorio-perdas.txt', { type: 'text/plain' });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: 'Relatório de Perdas Financeiras',
          text: 'Relatório de perdas causadas pela desativação',
          files: [file],
        });
      } catch (error) {
        console.error('Share failed:', error);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'relatorio-perdas.txt';
        a.click();
        URL.revokeObjectURL(url);
      }
    } else {
      await handleDownload();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Exportar Relatório</h3>
      <p className="text-base text-muted-foreground">
        Baixe ou compartilhe um relatório em texto com todos os cálculos de perdas financeiras
      </p>
      <div className="flex gap-4">
        <Button onClick={handleDownload} size="lg" className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Baixar TXT
        </Button>
        <Button onClick={handleShare} variant="outline" size="lg" className="flex-1">
          <Share2 className="mr-2 h-4 w-4" />
          Compartilhar
        </Button>
      </div>
    </div>
  );
}
