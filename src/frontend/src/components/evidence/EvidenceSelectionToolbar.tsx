import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { Evidence } from '../../types/backend-extended';
import { exportEvidenceFiles } from '../../lib/zipExport';

interface EvidenceSelectionToolbarProps {
  selectedEvidence: Evidence[];
  onClearSelection: () => void;
}

export default function EvidenceSelectionToolbar({
  selectedEvidence,
  onClearSelection,
}: EvidenceSelectionToolbarProps) {
  const handleExport = async () => {
    await exportEvidenceFiles(selectedEvidence);
  };

  if (selectedEvidence.length === 0) return null;

  return (
    <div className="bg-primary text-primary-foreground p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="font-medium">{selectedEvidence.length} selecionado(s)</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          <X className="h-4 w-4 mr-2" />
          Limpar
        </Button>
      </div>
    </div>
  );
}
