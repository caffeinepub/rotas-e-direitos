import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Camera, FileText, Mic, Video, Download } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useEvidenceFromIndexedDB } from '../../lib/evidenceIndexedDb';
import EvidenceSelectionToolbar from './EvidenceSelectionToolbar';
import { EvidenceType, Platform } from '../../types/backend-extended';
import EvidenceFilters from './EvidenceFilters';

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

export default function EvidenceTimeline() {
  const navigate = useNavigate();
  const { evidence, isLoading } = useEvidenceFromIndexedDB();
  const [selectedIds, setSelectedIds] = useState<Set<bigint>>(new Set());
  const [typeFilter, setTypeFilter] = useState<EvidenceType | 'all'>('all');
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');

  const filteredEvidence = evidence.filter((item) => {
    if (typeFilter !== 'all' && item.evidenceType !== typeFilter) return false;
    if (platformFilter !== 'all' && item.platform !== platformFilter) return false;
    return true;
  });

  const selectedEvidence = evidence.filter((item) => selectedIds.has(item.id));

  const toggleSelection = (id: bigint) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Linha do Tempo de Evidências</CardTitle>
          <CardDescription>Carregando evidências...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <EvidenceFilters
        typeFilter={typeFilter}
        platformFilter={platformFilter}
        onTypeFilterChange={setTypeFilter}
        onPlatformFilterChange={setPlatformFilter}
      />

      <EvidenceSelectionToolbar
        selectedEvidence={selectedEvidence}
        onClearSelection={clearSelection}
      />

      <Card>
        <CardHeader>
          <CardTitle>Linha do Tempo de Evidências</CardTitle>
          <CardDescription>
            {filteredEvidence.length} evidência(s) registrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEvidence.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma evidência encontrada
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvidence.map((item) => {
                const Icon = evidenceTypeIcons[item.evidenceType];
                const isSelected = selectedIds.has(item.id);

                return (
                  <div
                    key={item.id.toString()}
                    className={`flex items-start gap-4 p-4 border rounded-lg transition-colors ${
                      isSelected ? 'bg-accent border-primary' : 'hover:bg-accent/50'
                    }`}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelection(item.id)}
                    />
                    <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">
                          {evidenceTypeLabels[item.evidenceType]}
                        </Badge>
                        {item.platform && (
                          <Badge variant="secondary">{item.platform}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.notes || 'Sem notas'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(Number(item.uploadTime)).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        navigate({
                          to: '/evidencias/$evidenceId',
                          params: { evidenceId: item.id.toString() },
                        })
                      }
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
