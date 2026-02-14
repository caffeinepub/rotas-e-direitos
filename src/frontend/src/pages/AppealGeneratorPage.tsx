import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetAllEvidence } from '../hooks/useEvidence';
import { useGenerateAppeal } from '../hooks/useAppeals';
import { Platform, ReasonCategory } from '../backend';
import { toast } from 'sonner';
import { FileText, Send, AlertCircle } from 'lucide-react';
import FeatureGate from '../components/subscription/FeatureGate';

export default function AppealGeneratorPage() {
  const navigate = useNavigate();
  const { data: evidences = [] } = useGetAllEvidence();
  const generateAppeal = useGenerateAppeal();

  const [platform, setPlatform] = useState<Platform | ''>('');
  const [reason, setReason] = useState<ReasonCategory | ''>('');
  const [explanation, setExplanation] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState<Set<number>>(new Set());

  const handleEvidenceToggle = (evidenceId: number) => {
    const newSet = new Set(selectedEvidence);
    if (newSet.has(evidenceId)) {
      newSet.delete(evidenceId);
    } else {
      newSet.add(evidenceId);
    }
    setSelectedEvidence(newSet);
  };

  const handleGenerate = async () => {
    if (!platform || !reason || !explanation.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const appeal = await generateAppeal.mutateAsync({
        platform: platform as Platform,
        reasonCategory: reason as ReasonCategory,
        userExplanation: explanation,
        evidenceIds: Array.from(selectedEvidence).map(BigInt),
      });
      toast.success('Recurso gerado com sucesso!');
      navigate({ to: '/' });
    } catch (error: any) {
      if (error.message?.includes('trial expired') || error.message?.includes('subscription expired')) {
        toast.error('Sua assinatura expirou. Faça upgrade para continuar.');
        navigate({ to: '/planos' });
      } else {
        toast.error('Erro ao gerar recurso');
        console.error('Appeal generation error:', error);
      }
    }
  };

  return (
    <FeatureGate>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Gerador de Recursos</h1>
          <p className="text-xl text-muted-foreground">
            Crie recursos profissionais para contestar desativações
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Preencha as informações abaixo para gerar um recurso personalizado baseado em sua situação.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informações do Recurso
            </CardTitle>
            <CardDescription>Forneça os detalhes sobre sua desativação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="platform">Plataforma *</Label>
              <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Selecione a plataforma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ifood">iFood</SelectItem>
                  <SelectItem value="uber">Uber</SelectItem>
                  <SelectItem value="rappi">Rappi</SelectItem>
                  <SelectItem value="ninetyNine">99</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo da Desativação *</Label>
              <Select value={reason} onValueChange={(v) => setReason(v as ReasonCategory)}>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Selecione o motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="documentsExpired">Documentos Expirados</SelectItem>
                  <SelectItem value="selfieInvalid">Selfie Inválida</SelectItem>
                  <SelectItem value="lowRating">Avaliação Baixa</SelectItem>
                  <SelectItem value="dangerousConduct">Conduta Perigosa</SelectItem>
                  <SelectItem value="fraudSuspicion">Suspeita de Fraude</SelectItem>
                  <SelectItem value="multipleAccounts">Múltiplas Contas</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="explanation">Sua Explicação *</Label>
              <Textarea
                id="explanation"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Descreva sua situação e por que a desativação foi injusta..."
                rows={6}
              />
            </div>

            {evidences.length > 0 && (
              <div className="space-y-3">
                <Label>Evidências Anexadas (opcional)</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-4">
                  {evidences.map((evidence) => (
                    <div key={Number(evidence.id)} className="flex items-center gap-2">
                      <Checkbox
                        id={`evidence-${evidence.id}`}
                        checked={selectedEvidence.has(Number(evidence.id))}
                        onCheckedChange={() => handleEvidenceToggle(Number(evidence.id))}
                      />
                      <Label
                        htmlFor={`evidence-${evidence.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        Evidência #{evidence.id.toString()} - {evidence.notes.substring(0, 50)}
                        {evidence.notes.length > 50 ? '...' : ''}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={handleGenerate}
              disabled={generateAppeal.isPending}
            >
              {generateAppeal.isPending ? (
                'Gerando...'
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Gerar Recurso
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </FeatureGate>
  );
}
