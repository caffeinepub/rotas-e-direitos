import { Button } from '@/components/ui/button';
import { Download, CheckSquare, Square } from 'lucide-react';
import { exportEvidenceZip } from '../../lib/zipExport';
import { Evidence } from '../../backend';

interface EvidenceSelectionToolbarProps {
  selectedIds: Set<number>;
  evidence: Evidence[];
  onSelectAll: () => void;
  onSelectNone: () => void;
}

export default function EvidenceSelectionToolbar({
  selectedIds,
  evidence,
  onSelectAll,
  onSelectNone,
}: EvidenceSelectionToolbarProps) {
  const handleExport = async () => {
    const selectedEvidence = evidence.filter((e) => selectedIds.has(Number(e.id)));
    await exportEvidenceZip(selectedEvidence);
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-accent rounded-lg">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">{selectedIds.size} selecionado(s)</span>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onSelectAll}>
            <CheckSquare className="mr-2 h-4 w-4" />
            Selecionar Todos
          </Button>
          <Button variant="ghost" size="sm" onClick={onSelectNone}>
            <Square className="mr-2 h-4 w-4" />
            Limpar Seleção
          </Button>
        </div>
      </div>
      <Button onClick={handleExport} disabled={selectedIds.size === 0}>
        <Download className="mr-2 h-4 w-4" />
        Baixar Arquivos
      </Button>
    </div>
  );
}
