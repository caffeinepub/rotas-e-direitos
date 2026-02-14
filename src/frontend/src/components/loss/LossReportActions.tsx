import { Button } from '@/components/ui/button';
import { PublicLossProfile } from '../../types/backend-extended';
import { Download, Share2 } from 'lucide-react';
import { generateLossReport } from '../../lib/pdfReport';
import { toast } from 'sonner';

interface LossReportActionsProps {
  profile: PublicLossProfile;
}

export default function LossReportActions({ profile }: LossReportActionsProps) {
  const handleDownload = () => {
    try {
      const blob = generateLossReport(profile);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `loss-report-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Report downloaded');
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  const handleShare = async () => {
    try {
      const blob = generateLossReport(profile);
      const text = await blob.text();

      if (navigator.share) {
        await navigator.share({
          title: 'Loss Report',
          text: text,
        });
        toast.success('Report shared');
      } else {
        await navigator.clipboard.writeText(text);
        toast.success('Report copied to clipboard');
      }
    } catch (error) {
      toast.error('Failed to share report');
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleDownload} variant="outline">
        <Download className="h-4 w-4 mr-2" />
        Download Report
      </Button>
      <Button onClick={handleShare} variant="outline">
        <Share2 className="h-4 w-4 mr-2" />
        Share Report
      </Button>
    </div>
  );
}
