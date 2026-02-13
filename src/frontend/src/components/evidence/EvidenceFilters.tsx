import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EvidenceType, Platform } from '../../backend';

interface EvidenceFiltersProps {
  typeFilter: EvidenceType | null;
  setTypeFilter: (type: EvidenceType | null) => void;
  platformFilter: Platform | null;
  setPlatformFilter: (platform: Platform | null) => void;
}

export default function EvidenceFilters({
  typeFilter,
  setTypeFilter,
  platformFilter,
  setPlatformFilter,
}: EvidenceFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="type-filter" className="text-base">
          Filtrar por Tipo
        </Label>
        <Select value={typeFilter || 'all'} onValueChange={(v) => setTypeFilter(v === 'all' ? null : (v as EvidenceType))}>
          <SelectTrigger id="type-filter" className="h-12 text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value={EvidenceType.selfie}>Selfie</SelectItem>
            <SelectItem value={EvidenceType.screenshot}>Print</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="platform-filter" className="text-base">
          Filtrar por Plataforma
        </Label>
        <Select
          value={platformFilter || 'all'}
          onValueChange={(v) => setPlatformFilter(v === 'all' ? null : (v as Platform))}
        >
          <SelectTrigger id="platform-filter" className="h-12 text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Plataformas</SelectItem>
            <SelectItem value={Platform.ifood}>iFood</SelectItem>
            <SelectItem value={Platform.uber}>Uber</SelectItem>
            <SelectItem value={Platform.rappi}>Rappi</SelectItem>
            <SelectItem value={Platform.ninetyNine}>99</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
