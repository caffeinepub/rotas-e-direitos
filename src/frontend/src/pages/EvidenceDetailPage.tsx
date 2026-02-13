import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetEvidenceById } from '../hooks/useEvidence';
import { useEvidenceImage } from '../lib/evidenceIndexedDb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, FileText, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { EvidenceType, Platform } from '../backend';

const platformLabels: Record<Platform, string> = {
  [Platform.ifood]: 'iFood',
  [Platform.uber]: 'Uber',
  [Platform.rappi]: 'Rappi',
  [Platform.ninetyNine]: '99',
};

const typeLabels: Record<EvidenceType, string> = {
  [EvidenceType.selfie]: 'Selfie',
  [EvidenceType.screenshot]: 'Print',
};

export default function EvidenceDetailPage() {
  const { evidenceId } = useParams({ from: '/evidencias/$evidenceId' });
  const navigate = useNavigate();
  const { data: evidence, isLoading } = useGetEvidenceById(Number(evidenceId));
  const imageUrl = useEvidenceImage(Number(evidenceId));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!evidence) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/evidencias' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Evidência não encontrada</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Button variant="ghost" onClick={() => navigate({ to: '/evidencias' })} size="lg">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para Evidências
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-3xl">Detalhes da Evidência</CardTitle>
            <Badge variant="outline" className="text-base px-3 py-1">
              {typeLabels[evidence.evidenceType]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {imageUrl && (
            <div className="rounded-lg overflow-hidden border border-border">
              <img src={imageUrl} alt="Evidência" className="w-full h-auto" />
            </div>
          )}

          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Data de Upload</p>
                <p className="text-lg">
                  {format(new Date(Number(evidence.uploadTime) / 1000000), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>

            {evidence.platform && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Plataforma</p>
                  <p className="text-lg">{platformLabels[evidence.platform]}</p>
                </div>
              </div>
            )}

            {evidence.notes && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Observações</p>
                <p className="text-base leading-relaxed">{evidence.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
