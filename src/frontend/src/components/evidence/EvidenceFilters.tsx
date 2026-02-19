import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { EvidenceType, Platform } from '../../types/backend-extended';

interface EvidenceFiltersProps {
  typeFilter: EvidenceType | 'all';
  platformFilter: Platform | 'all';
  onTypeFilterChange: (value: EvidenceType | 'all') => void;
  onPlatformFilterChange: (value: Platform | 'all') => void;
}

export default function EvidenceFilters({
  typeFilter,
  platformFilter,
  onTypeFilterChange,
  onPlatformFilterChange,
}: EvidenceFiltersProps) {
  return (
    <div className="flex gap-4 flex-wrap">
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="type-filter">Tipo</Label>
        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger id="type-filter">
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value={EvidenceType.selfie}>Selfie</SelectItem>
            <SelectItem value={EvidenceType.screenshot}>Screenshot</SelectItem>
            <SelectItem value={EvidenceType.audio}>Áudio</SelectItem>
            <SelectItem value={EvidenceType.video}>Vídeo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="platform-filter">Plataforma</Label>
        <Select value={platformFilter} onValueChange={onPlatformFilterChange}>
          <SelectTrigger id="platform-filter">
            <SelectValue placeholder="Todas as plataformas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as plataformas</SelectItem>
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
