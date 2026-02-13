import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetTimeline } from '../../hooks/useEvidence';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import EvidenceFilters from './EvidenceFilters';
import EvidenceSelectionToolbar from './EvidenceSelectionToolbar';
import { useEvidenceImage } from '../../lib/evidenceIndexedDb';
import { EvidenceType, Platform } from '../../backend';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Loader2 } from 'lucide-react';

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

function EvidenceCard({ evidence, isSelected, onToggle }: any) {
  const imageUrl = useEvidenceImage(Number(evidence.id));
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: '/evidencias/$evidenceId', params: { evidenceId: String(evidence.id) } });
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
              {imageUrl ? (
                <img src={imageUrl} alt="Evidência" className="w-24 h-24 object-cover rounded-lg" />
              ) : (
                <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              )}

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

  const selectAll = () => {
    setSelectedIds(new Set(evidence.map((e) => Number(e.id))));
  };

  const selectNone = () => {
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
              evidence={evidence}
              onSelectAll={selectAll}
              onSelectNone={selectNone}
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
