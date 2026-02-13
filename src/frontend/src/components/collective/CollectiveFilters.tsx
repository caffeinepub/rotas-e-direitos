import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Platform, ReasonCategory, Region } from '../../backend';

interface CollectiveFiltersProps {
  platformFilter: Platform | null;
  setPlatformFilter: (platform: Platform | null) => void;
  reasonFilter: ReasonCategory | null;
  setReasonFilter: (reason: ReasonCategory | null) => void;
  regionFilter: Region | null;
  setRegionFilter: (region: Region | null) => void;
  periodDays: number;
  setPeriodDays: (days: number) => void;
}

const platformLabels: Record<Platform, string> = {
  [Platform.ifood]: 'iFood',
  [Platform.uber]: 'Uber',
  [Platform.rappi]: 'Rappi',
  [Platform.ninetyNine]: '99',
};

const reasonLabels: Record<ReasonCategory, string> = {
  [ReasonCategory.documentsExpired]: 'Documentos Vencidos',
  [ReasonCategory.selfieInvalid]: 'Selfie Inválida',
  [ReasonCategory.lowRating]: 'Baixa Avaliação',
  [ReasonCategory.dangerousConduct]: 'Conduta Perigosa',
  [ReasonCategory.fraudSuspicion]: 'Suspeita de Fraude',
  [ReasonCategory.multipleAccounts]: 'Múltiplas Contas',
  [ReasonCategory.other]: 'Outro',
};

const regionLabels: Record<Region, string> = {
  [Region.fortaleza]: 'Fortaleza',
  [Region.caucaia]: 'Caucaia',
  [Region.maracanau]: 'Maracanaú',
};

export default function CollectiveFilters({
  platformFilter,
  setPlatformFilter,
  reasonFilter,
  setReasonFilter,
  regionFilter,
  setRegionFilter,
  periodDays,
  setPeriodDays,
}: CollectiveFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor="platform-filter" className="text-base">
          Plataforma
        </Label>
        <Select
          value={platformFilter || 'all'}
          onValueChange={(v) => setPlatformFilter(v === 'all' ? null : (v as Platform))}
        >
          <SelectTrigger id="platform-filter" className="h-12 text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {Object.entries(platformLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason-filter" className="text-base">
          Motivo
        </Label>
        <Select
          value={reasonFilter || 'all'}
          onValueChange={(v) => setReasonFilter(v === 'all' ? null : (v as ReasonCategory))}
        >
          <SelectTrigger id="reason-filter" className="h-12 text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(reasonLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="region-filter" className="text-base">
          Região
        </Label>
        <Select
          value={regionFilter || 'all'}
          onValueChange={(v) => setRegionFilter(v === 'all' ? null : (v as Region))}
        >
          <SelectTrigger id="region-filter" className="h-12 text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {Object.entries(regionLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="period-filter" className="text-base">
          Período
        </Label>
        <Select value={periodDays.toString()} onValueChange={(v) => setPeriodDays(parseInt(v))}>
          <SelectTrigger id="period-filter" className="h-12 text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">Últimos 30 dias</SelectItem>
            <SelectItem value="90">Últimos 90 dias</SelectItem>
            <SelectItem value="365">Último ano</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
