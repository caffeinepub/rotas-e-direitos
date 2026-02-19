import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { EvidenceType, Platform } from '../../types/backend-extended';
import { useEvidenceFromIndexedDB } from '../../lib/evidenceIndexedDb';

interface EvidencePickerProps {
  selectedIds: bigint[];
  onSelectionChange: (ids: bigint[]) => void;
}

const evidenceTypeLabels = {
  [EvidenceType.selfie]: 'Selfie',
  [EvidenceType.screenshot]: 'Screenshot',
  [EvidenceType.audio]: 'Áudio',
  [EvidenceType.video]: 'Vídeo',
};

export default function EvidencePicker({ selectedIds, onSelectionChange }: EvidencePickerProps) {
  const { evidence, isLoading } = useEvidenceFromIndexedDB();

  const toggleSelection = (id: bigint) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Evidências</CardTitle>
          <CardDescription>Carregando evidências...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecionar Evidências</CardTitle>
        <CardDescription>
          Escolha as evidências que deseja anexar ao recurso ({selectedIds.length} selecionada(s))
        </CardDescription>
      </CardHeader>
      <CardContent>
        {evidence.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma evidência disponível
          </div>
        ) : (
          <div className="space-y-2">
            {evidence.map((item) => (
              <div
                key={item.id.toString()}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <Checkbox
                  checked={selectedIds.includes(item.id)}
                  onCheckedChange={() => toggleSelection(item.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline">{evidenceTypeLabels[item.evidenceType]}</Badge>
                    {item.platform && <Badge variant="secondary">{item.platform}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {item.notes || 'Sem notas'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
