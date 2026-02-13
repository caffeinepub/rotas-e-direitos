import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Platform, ReasonCategory } from '../../backend';
import { useGenerateAppeal } from '../../hooks/useAppeals';
import EvidencePicker from './EvidencePicker';
import AppealEditor from './AppealEditor';
import CollectiveSharePrompt from '../collective/CollectiveSharePrompt';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

const platformLabels: Record<Platform, string> = {
  [Platform.ifood]: 'iFood',
  [Platform.uber]: 'Uber',
  [Platform.rappi]: 'Rappi',
  [Platform.ninetyNine]: '99',
};

const reasonLabels: Record<ReasonCategory, string> = {
  [ReasonCategory.documentsExpired]: 'Documentos Vencidos',
  [ReasonCategory.selfieInvalid]: 'Selfie Inválida/Não Reconhecida',
  [ReasonCategory.lowRating]: 'Baixa Avaliação',
  [ReasonCategory.dangerousConduct]: 'Conduta Perigosa',
  [ReasonCategory.fraudSuspicion]: 'Suspeita de Fraude',
  [ReasonCategory.multipleAccounts]: 'Múltiplas Contas',
  [ReasonCategory.other]: 'Outro',
};

export default function AppealWizard() {
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState<Platform>(Platform.ifood);
  const [reason, setReason] = useState<ReasonCategory>(ReasonCategory.selfieInvalid);
  const [explanation, setExplanation] = useState('');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<number[]>([]);
  const [generatedAppealId, setGeneratedAppealId] = useState<number | null>(null);
  const [showCollectivePrompt, setShowCollectivePrompt] = useState(false);

  const { mutate: generateAppeal, isPending } = useGenerateAppeal();

  const handleGenerate = () => {
    generateAppeal(
      {
        platform,
        reasonCategory: reason,
        userExplanation: explanation,
        evidenceIds: selectedEvidenceIds.map((id) => BigInt(id)),
      },
      {
        onSuccess: (appeal) => {
          setGeneratedAppealId(Number(appeal.id));
          setStep(4);
          setShowCollectivePrompt(true);
        },
      }
    );
  };

  const canProceedStep1 = platform && reason;
  const canProceedStep2 = explanation.trim().length > 0;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Etapa {step} de 4: {step === 1 && 'Informações Básicas'}
            {step === 2 && 'Sua Versão dos Fatos'}
            {step === 3 && 'Selecionar Evidências'}
            {step === 4 && 'Revisar e Enviar'}
          </CardTitle>
          <CardDescription className="text-base">
            {step === 1 && 'Selecione a plataforma e o motivo da desativação'}
            {step === 2 && 'Descreva o que aconteceu com suas próprias palavras'}
            {step === 3 && 'Escolha as evidências que deseja anexar ao recurso'}
            {step === 4 && 'Revise o texto gerado e envie seu recurso'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform" className="text-base">
                  Qual plataforma te bloqueou? *
                </Label>
                <Select value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
                  <SelectTrigger id="platform" className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(platformLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason" className="text-base">
                  Qual motivo foi informado? *
                </Label>
                <Select value={reason} onValueChange={(v) => setReason(v as ReasonCategory)}>
                  <SelectTrigger id="reason" className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(reasonLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <Label htmlFor="explanation" className="text-base">
                Descreva sua versão dos fatos *
              </Label>
              <Textarea
                id="explanation"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Conte o que aconteceu de forma simples. Exemplo: Mudei meu visual recentemente (cortei o cabelo e tirei a barba), mas continuo sendo a mesma pessoa. Tenho selfies diárias que comprovam minha identidade..."
                className="min-h-[200px] text-base"
              />
            </div>
          )}

          {step === 3 && (
            <EvidencePicker
              selectedIds={selectedEvidenceIds}
              onSelectionChange={setSelectedEvidenceIds}
            />
          )}

          {step === 4 && generatedAppealId && (
            <AppealEditor appealId={generatedAppealId} platform={platform} />
          )}

          <div className="flex gap-4">
            {step > 1 && step < 4 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} size="lg">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            )}

            {step < 3 && (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={(step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)}
                size="lg"
                className="flex-1"
              >
                Próximo
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}

            {step === 3 && (
              <Button onClick={handleGenerate} disabled={isPending} size="lg" className="flex-1">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  'Gerar Recurso'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {showCollectivePrompt && (
        <CollectiveSharePrompt
          platform={platform}
          reason={reason}
          onClose={() => setShowCollectivePrompt(false)}
        />
      )}
    </>
  );
}
