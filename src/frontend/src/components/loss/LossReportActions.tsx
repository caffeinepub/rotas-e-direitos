import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PublicLossProfile } from '../../types/backend-extended';
import { Download, Share2, Loader2 } from 'lucide-react';
import { generateLossReportPDF } from '../../lib/pdfReport';
import { toast } from 'sonner';
import { calculateWeeklyLoss, calculateMonthlyLoss, calculateAccumulatedLoss } from '../../lib/lossCalculations';

interface LossReportActionsProps {
  profile: PublicLossProfile;
}

export default function LossReportActions({ profile }: LossReportActionsProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateLossReportPDF(profile);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      a.download = `relatorio-perdas-financeiras-${dateStr}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Relatório PDF baixado com sucesso');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Erro ao gerar relatório PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    try {
      const weeklyLoss = calculateWeeklyLoss(profile);
      const monthlyLoss = calculateMonthlyLoss(profile);
      const accumulatedLoss = calculateAccumulatedLoss(profile);
      const deactivationDate = new Date(Number(profile.deactivationDate));

      const text = `📊 Relatório de Perdas Financeiras

Plataforma: ${profile.platform}
Data da Desativação: ${deactivationDate.toLocaleDateString('pt-BR')}

💰 Perdas Calculadas:
• Semanal: R$ ${weeklyLoss.toFixed(2)}
• Mensal: R$ ${monthlyLoss.toFixed(2)}
• Acumulada: R$ ${accumulatedLoss.toFixed(2)}

Gerado via Rotas e Direitos`;

      if (navigator.share) {
        await navigator.share({
          title: 'Relatório de Perdas Financeiras',
          text: text,
        });
        toast.success('Relatório compartilhado');
      } else {
        await navigator.clipboard.writeText(text);
        toast.success('Relatório copiado para área de transferência');
      }
    } catch (error) {
      toast.error('Erro ao compartilhar relatório');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button 
        onClick={handleDownloadPDF} 
        disabled={isGenerating}
        className="flex-1 h-12"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            Gerando PDF...
          </>
        ) : (
          <>
            <Download className="h-5 w-5 mr-2" />
            Baixar Relatório PDF
          </>
        )}
      </Button>
      <Button 
        onClick={handleShare} 
        variant="outline"
        className="flex-1 h-12"
        size="lg"
      >
        <Share2 className="h-5 w-5 mr-2" />
        Compartilhar Resumo
      </Button>
    </div>
  );
}
