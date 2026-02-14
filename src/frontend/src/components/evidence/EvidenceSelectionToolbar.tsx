import { Button } from '@/components/ui/button';
import { Download, CheckSquare, Square } from 'lucide-react';
import { exportEvidenceFiles } from '../../lib/zipExport';
import { Evidence } from '../../backend';

interface EvidenceSelectionToolbarProps {
  selectedIds: Set<number>;
  allEvidence: Evidence[];
  onClearSelection: () => void;
}

export default function EvidenceSelectionToolbar({
  selectedIds,
  allEvidence,
  onClearSelection,
}: EvidenceSelectionToolbarProps) {
  const handleExport = async () => {
    const selectedEvidence = allEvidence.filter((e) => selectedIds.has(Number(e.id)));
    await exportEvidenceFiles(selectedEvidence);
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-accent rounded-lg">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">{selectedIds.size} selected</span>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          <Square className="mr-2 h-4 w-4" />
          Clear Selection
        </Button>
      </div>
      <Button onClick={handleExport} disabled={selectedIds.size === 0}>
        <Download className="mr-2 h-4 w-4" />
        Download Files
      </Button>
    </div>
  );
}
