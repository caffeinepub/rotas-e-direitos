import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Share2, CheckCircle2 } from 'lucide-react';
import { useSubmitCollectiveReport } from '../../hooks/useCollectiveReports';
import { getNeighborhoods } from '../../lib/collectiveOptions';
import { Platform, Region } from '../../types/backend-extended';
import { ReasonCategory } from '../../types/backend-extended';
import { toast } from 'sonner';

export default function CollectiveSharePrompt() {
  const [platform, setPlatform] = useState<Platform | ''>('');
  const [region, setRegion] = useState<Region | ''>('');
  const [neighborhood, setNeighborhood] = useState('');
  const [reason, setReason] = useState<ReasonCategory | ''>('');
  const [submitted, setSubmitted] = useState(false);

  const submitReport = useSubmitCollectiveReport();

  const neighborhoods = region ? getNeighborhoods(region) : [];

  const handleSubmit = async () => {
    if (!platform || !region || !neighborhood || !reason) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    try {
      await submitReport.mutateAsync({
        platform: platform as Platform,
        region: region as Region,
        neighborhood,
        reason: reason as ReasonCategory,
      });
      setSubmitted(true);
      toast.success('Relatório enviado com sucesso!');
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setPlatform('');
        setRegion('');
        setNeighborhood('');
        setReason('');
        setSubmitted(false);
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao enviar relatório');
    }
  };

  if (submitted) {
    return (
      <Card className="border-green-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            Obrigado por Compartilhar!
          </CardTitle>
          <CardDescription>Seu relatório ajuda a comunidade</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-green-600 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Seu relatório foi registrado e contribui para os dados coletivos da comunidade.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compartilhar Experiência</CardTitle>
        <CardDescription>
          Ajude a comunidade compartilhando sua experiência de forma anônima
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="share-platform">Plataforma</Label>
          <Select value={platform} onValueChange={(value) => setPlatform(value as Platform)}>
            <SelectTrigger id="share-platform">
              <SelectValue placeholder="Selecione a plataforma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Platform.ifood}>iFood</SelectItem>
              <SelectItem value={Platform.uber}>Uber</SelectItem>
              <SelectItem value={Platform.rappi}>Rappi</SelectItem>
              <SelectItem value={Platform.ninetyNine}>99</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="share-region">Região</Label>
          <Select value={region} onValueChange={(value) => setRegion(value as Region)}>
            <SelectTrigger id="share-region">
              <SelectValue placeholder="Selecione a região" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Region.fortaleza}>Fortaleza</SelectItem>
              <SelectItem value={Region.caucaia}>Caucaia</SelectItem>
              <SelectItem value={Region.maracanau}>Maracanaú</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {region && (
          <div className="space-y-2">
            <Label htmlFor="share-neighborhood">Bairro</Label>
            <Select value={neighborhood} onValueChange={setNeighborhood}>
              <SelectTrigger id="share-neighborhood">
                <SelectValue placeholder="Selecione o bairro" />
              </SelectTrigger>
              <SelectContent>
                {neighborhoods.map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="share-reason">Motivo do Bloqueio</Label>
          <Select value={reason} onValueChange={(value) => setReason(value as ReasonCategory)}>
            <SelectTrigger id="share-reason">
              <SelectValue placeholder="Selecione o motivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ReasonCategory.documentsExpired}>Documentos Vencidos</SelectItem>
              <SelectItem value={ReasonCategory.selfieInvalid}>Selfie Inválida</SelectItem>
              <SelectItem value={ReasonCategory.lowRating}>Avaliação Baixa</SelectItem>
              <SelectItem value={ReasonCategory.dangerousConduct}>Conduta Perigosa</SelectItem>
              <SelectItem value={ReasonCategory.fraudSuspicion}>Suspeita de Fraude</SelectItem>
              <SelectItem value={ReasonCategory.multipleAccounts}>Múltiplas Contas</SelectItem>
              <SelectItem value={ReasonCategory.other}>Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={submitReport.isPending || !platform || !region || !neighborhood || !reason}
          className="w-full"
        >
          <Share2 className="h-4 w-4 mr-2" />
          {submitReport.isPending ? 'Enviando...' : 'Compartilhar Anonimamente'}
        </Button>
      </CardContent>
    </Card>
  );
}
