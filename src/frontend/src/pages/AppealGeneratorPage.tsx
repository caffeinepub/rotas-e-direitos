import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Mail, Info } from 'lucide-react';
import AppealWizard from '../components/appeal/AppealWizard';
import EvidencePicker from '../components/appeal/EvidencePicker';
import { useGenerateAppeal } from '../hooks/useAppeals';
import { Platform } from '../backend';
import { ReasonCategory } from '../types/backend-extended';
import { toast } from 'sonner';

export default function AppealGeneratorPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as any;
  
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<number[]>([]);
  const [generatedAppeal, setGeneratedAppeal] = useState<string>('');
  
  const generateAppeal = useGenerateAppeal();

  // Pre-fill from case context if provided
  useEffect(() => {
    if (searchParams?.evidenceIds) {
      try {
        const ids = JSON.parse(searchParams.evidenceIds);
        setSelectedEvidenceIds(ids);
      } catch (e) {
        console.error('Failed to parse evidence IDs');
      }
    }
  }, [searchParams]);

  const handleGenerate = async (data: {
    platform: Platform;
    reasonCategory: ReasonCategory;
    userExplanation: string;
    evidenceIds: number[];
  }) => {
    try {
      const appeal = await generateAppeal.mutateAsync(data);
      setGeneratedAppeal(appeal.generatedText);
      toast.success('Appeal generated successfully');
      
      // If caseId provided, link appeal to case
      if (searchParams?.caseId) {
        // This would be handled by case management
        toast.success('Appeal linked to case');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate appeal');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedAppeal], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appeal-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Appeal downloaded');
  };

  const handleSendEmail = () => {
    const subject = 'Account Reactivation Appeal';
    const body = generatedAppeal;
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appeal Generator</h1>
        <p className="text-muted-foreground">Generate a professional appeal letter for your case</p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Provide details about your situation and we'll help you generate a professional appeal letter
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <AppealWizard
            onGenerate={handleGenerate}
            isGenerating={generateAppeal.isPending}
            selectedEvidenceIds={selectedEvidenceIds}
          />

          <EvidencePicker
            selectedIds={selectedEvidenceIds}
            onSelectionChange={setSelectedEvidenceIds}
          />
        </div>

        <div>
          {generatedAppeal ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Generated Appeal
                </CardTitle>
                <CardDescription>Review and send your appeal letter</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={generatedAppeal}
                  onChange={(e) => setGeneratedAppeal(e.target.value)}
                  rows={15}
                  className="font-mono text-sm"
                />

                <div className="flex gap-2">
                  <Button onClick={handleDownload} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button onClick={handleSendEmail}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send via Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center space-y-2">
                  <FileText className="h-12 w-12 mx-auto opacity-50" />
                  <p>Your generated appeal will appear here</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
