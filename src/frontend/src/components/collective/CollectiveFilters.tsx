import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Platform, Region } from '../../backend';
import { ReasonCategory } from '../../types/backend-extended';

interface CollectiveFiltersProps {
  platform: Platform | 'all';
  region: Region | 'all';
  reason: ReasonCategory | 'all';
  onPlatformChange: (value: Platform | 'all') => void;
  onRegionChange: (value: Region | 'all') => void;
  onReasonChange: (value: ReasonCategory | 'all') => void;
}

export default function CollectiveFilters({
  platform,
  region,
  reason,
  onPlatformChange,
  onRegionChange,
  onReasonChange,
}: CollectiveFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-2">
        <Label>Platform</Label>
        <Select value={platform} onValueChange={onPlatformChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="uber">Uber</SelectItem>
            <SelectItem value="ninetyNine">99</SelectItem>
            <SelectItem value="ifood">iFood</SelectItem>
            <SelectItem value="rappi">Rappi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Region</Label>
        <Select value={region} onValueChange={onRegionChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="fortaleza">Fortaleza</SelectItem>
            <SelectItem value="caucaia">Caucaia</SelectItem>
            <SelectItem value="maracanau">Maracanaú</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Reason</Label>
        <Select value={reason} onValueChange={onReasonChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reasons</SelectItem>
            <SelectItem value="documentsExpired">Documents Expired</SelectItem>
            <SelectItem value="selfieInvalid">Selfie Invalid</SelectItem>
            <SelectItem value="lowRating">Low Rating</SelectItem>
            <SelectItem value="dangerousConduct">Dangerous Conduct</SelectItem>
            <SelectItem value="fraudSuspicion">Fraud Suspicion</SelectItem>
            <SelectItem value="multipleAccounts">Multiple Accounts</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
