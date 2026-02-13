import { useGetAllEvidence } from '../../hooks/useEvidence';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { EvidenceType, Platform } from '../../backend';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';

interface EvidencePickerProps {
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

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

export default function EvidencePicker({ selectedIds, onSelectionChange }: EvidencePickerProps) {
  const { data: evidence = [], isLoading } = useGetAllEvidence();

  const toggleSelection = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (evidence.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">
            Você ainda não tem evidências cadastradas. Vá para o Rastreador de Evidências para adicionar.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Selecione as evidências que deseja mencionar no recurso ({selectedIds.length} selecionada(s))
      </p>
      {evidence.map((item) => (
        <Card key={Number(item.id)} className="cursor-pointer" onClick={() => toggleSelection(Number(item.id))}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Checkbox
                checked={selectedIds.includes(Number(item.id))}
                onCheckedChange={() => toggleSelection(Number(item.id))}
                className="mt-1"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">{typeLabels[item.evidenceType]}</Badge>
                  {item.platform && <Badge variant="secondary">{platformLabels[item.platform]}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(Number(item.uploadTime) / 1000000), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
                {item.notes && <p className="text-sm line-clamp-2">{item.notes}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
