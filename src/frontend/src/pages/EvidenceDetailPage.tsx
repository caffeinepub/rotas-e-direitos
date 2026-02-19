import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Camera, FileText, Mic, Video } from 'lucide-react';
import { useEvidenceFromIndexedDB, useMediaFromIndexedDB } from '../lib/evidenceIndexedDb';
import { EvidenceType, Platform } from '../types/backend-extended';

const evidenceTypeIcons = {
  [EvidenceType.selfie]: Camera,
  [EvidenceType.screenshot]: FileText,
  [EvidenceType.audio]: Mic,
  [EvidenceType.video]: Video,
};

const evidenceTypeLabels = {
  [EvidenceType.selfie]: 'Selfie',
  [EvidenceType.screenshot]: 'Screenshot',
  [EvidenceType.audio]: 'Áudio',
  [EvidenceType.video]: 'Vídeo',
};

export default function EvidenceDetailPage() {
  const { evidenceId } = useParams({ from: '/evidencias/$evidenceId' });
  const navigate = useNavigate();
  const { evidence, isLoading } = useEvidenceFromIndexedDB();
  const item = evidence.find((e) => e.id.toString() === evidenceId);
  const { mediaUrl, isLoading: mediaLoading } = useMediaFromIndexedDB(item?.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/evidencias' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Carregando...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/evidencias' })}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Evidência não encontrada</CardTitle>
            <CardDescription>A evidência solicitada não existe</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const Icon = evidenceTypeIcons[item.evidenceType];

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate({ to: '/evidencias' })}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon className="h-6 w-6 text-muted-foreground" />
            <div>
              <CardTitle>Detalhes da Evidência</CardTitle>
              <CardDescription>
                {new Date(Number(item.uploadTime)).toLocaleString('pt-BR')}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Badge variant="outline">{evidenceTypeLabels[item.evidenceType]}</Badge>
            {item.platform && <Badge variant="secondary">{item.platform}</Badge>}
            {item.regiao && <Badge variant="secondary">{item.regiao}</Badge>}
          </div>

          {mediaUrl && !mediaLoading && (
            <div className="rounded-lg overflow-hidden border">
              {(item.evidenceType === EvidenceType.selfie ||
                item.evidenceType === EvidenceType.screenshot) && (
                <img src={mediaUrl} alt="Evidence" className="w-full h-auto" />
              )}
              {item.evidenceType === EvidenceType.audio && (
                <audio controls className="w-full">
                  <source src={mediaUrl} type="audio/webm" />
                  Seu navegador não suporta o elemento de áudio.
                </audio>
              )}
              {item.evidenceType === EvidenceType.video && (
                <video controls className="w-full h-auto">
                  <source src={mediaUrl} type="video/webm" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              )}
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-2">Notas</h3>
            <p className="text-muted-foreground">{item.notes || 'Sem notas'}</p>
          </div>

          {item.bairro && (
            <div>
              <h3 className="font-semibold mb-2">Bairro</h3>
              <p className="text-muted-foreground">{item.bairro}</p>
            </div>
          )}

          {item.duration && (
            <div>
              <h3 className="font-semibold mb-2">Duração</h3>
              <p className="text-muted-foreground">{Number(item.duration)} segundos</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
