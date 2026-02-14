import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetTimeline } from '../../hooks/useEvidence';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import EvidenceFilters from './EvidenceFilters';
import EvidenceSelectionToolbar from './EvidenceSelectionToolbar';
import { useEvidenceMedia } from '../../lib/evidenceIndexedDb';
import { EvidenceType, Platform } from '../../backend';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Loader2, Mic, Video } from 'lucide-react';

const platformLabels: Record<Platform, string> = {
  [Platform.ifood]: 'iFood',
  [Platform.uber]: 'Uber',
  [Platform.rappi]: 'Rappi',
  [Platform.ninetyNine]: '99',
};

const typeLabels: Record<EvidenceType, string> = {
  [EvidenceType.selfie]: 'Selfie',
  [EvidenceType.screenshot]: 'Print',
  [EvidenceType.audio]: 'Áudio',
  [EvidenceType.video]: 'Vídeo',
};

function EvidenceCard({ evidence, isSelected, onToggle }: any) {
  const { url: mediaUrl, mediaType } = useEvidenceMedia(Number(evidence.id));
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: '/evidencias/$evidenceId', params: { evidenceId: String(evidence.id) } });
  };

  const renderPreview = () => {
    if (!mediaUrl) {
      return (
        <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
      );
    }

    if (mediaType === 'image' || evidence.evidenceType === EvidenceType.selfie || evidence.evidenceType === EvidenceType.screenshot) {
      return <img src={mediaUrl} alt="Evidência" className="w-24 h-24 object-cover rounded-lg" />;
    }

    if (mediaType === 'audio' || evidence.evidenceType === EvidenceType.audio) {
      return (
        <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
          <Mic className="h-8 w-8 text-muted-foreground" />
        </div>
      );
    }

    if (mediaType === 'video' || evidence.evidenceType === EvidenceType.video) {
      return (
        <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
          <Video className="h-8 w-8 text-muted-foreground" />
        </div>
      );
    }

    return (
      <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          <div className="flex items-start pt-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggle}
              className="h-5 w-5"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="flex-1 min-w-0 cursor-pointer" onClick={handleClick}>
            <div className="flex gap-4">
              {renderPreview()}

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start gap-2 flex-wrap">
                  <Badge variant="outline">{typeLabels[evidence.evidenceType]}</Badge>
                  {evidence.platform && <Badge variant="secondary">{platformLabels[evidence.platform]}</Badge>}
                </div>

                <p className="text-sm text-muted-foreground">
                  {format(new Date(Number(evidence.uploadTime) / 1000000), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>

                {evidence.notes && (
                  <p className="text-sm line-clamp-2 text-muted-foreground">{evidence.notes}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EvidenceTimeline() {
  const [typeFilter, setTypeFilter] = useState<EvidenceType | null>(null);
  const [platformFilter, setPlatformFilter] = useState<Platform | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const { data: evidence = [], isLoading } = useGetTimeline({
    typeFilter,
    platformFilter,
  });

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Linha do Tempo de Evidências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <EvidenceFilters
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            platformFilter={platformFilter}
            setPlatformFilter={setPlatformFilter}
          />

          {selectedIds.size > 0 && (
            <EvidenceSelectionToolbar
              selectedIds={selectedIds}
              allEvidence={evidence}
              onClearSelection={clearSelection}
            />
          )}

          {evidence.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Nenhuma evidência encontrada</p>
              <p className="text-sm text-muted-foreground mt-2">
                Adicione sua primeira evidência usando o formulário acima
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {evidence.map((item) => (
                <EvidenceCard
                  key={Number(item.id)}
                  evidence={item}
                  isSelected={selectedIds.has(Number(item.id))}
                  onToggle={() => toggleSelection(Number(item.id))}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
