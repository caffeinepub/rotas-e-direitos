import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Platform, Region } from '../../types/backend-extended';
import { ReasonCategory } from '../../types/backend-extended';

interface CollectiveFiltersProps {
  platformFilter: Platform | 'all';
  regionFilter: Region | 'all';
  reasonFilter: ReasonCategory | 'all';
  onPlatformChange: (value: Platform | 'all') => void;
  onRegionChange: (value: Region | 'all') => void;
  onReasonChange: (value: ReasonCategory | 'all') => void;
}

export default function CollectiveFilters({
  platformFilter,
  regionFilter,
  reasonFilter,
  onPlatformChange,
  onRegionChange,
  onReasonChange,
}: CollectiveFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="platform-filter">Plataforma</Label>
        <Select value={platformFilter} onValueChange={onPlatformChange}>
          <SelectTrigger id="platform-filter">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value={Platform.ifood}>iFood</SelectItem>
            <SelectItem value={Platform.uber}>Uber</SelectItem>
            <SelectItem value={Platform.rappi}>Rappi</SelectItem>
            <SelectItem value={Platform.ninetyNine}>99</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="region-filter">Região</Label>
        <Select value={regionFilter} onValueChange={onRegionChange}>
          <SelectTrigger id="region-filter">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value={Region.fortaleza}>Fortaleza</SelectItem>
            <SelectItem value={Region.caucaia}>Caucaia</SelectItem>
            <SelectItem value={Region.maracanau}>Maracanaú</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason-filter">Motivo</Label>
        <Select value={reasonFilter} onValueChange={onReasonChange}>
          <SelectTrigger id="reason-filter">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value={ReasonCategory.documentsExpired}>Documentos Vencidos</SelectItem>
            <SelectItem value={ReasonCategory.selfieInvalid}>Selfie Inválida</SelectItem>
            <SelectItem value={ReasonCategory.lowRating}>Avaliação Baixa</SelectItem>
            <SelectItem value={ReasonCategory.dangerousConduct}>Conduta Perigosa</SelectItem>
            <SelectItem value={ReasonCategory.fraudSuspicion}>Suspeita de Fraude</SelectItem>
            <SelectItem value={ReasonCategory.multipleAccounts}>Múltiplas Contas</SelectItem>
            <SelectItem value={ReasonCategory.other}>Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
