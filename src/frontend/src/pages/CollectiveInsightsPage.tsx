import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, TrendingUp, Info } from 'lucide-react';
import { Platform, Region } from '../backend';
import { ReasonCategory } from '../types/backend-extended';
import { useGetCollectiveReports } from '../hooks/useCollectiveReports';
import CollectiveFilters from '../components/collective/CollectiveFilters';
import CollectiveSharePrompt from '../components/collective/CollectiveSharePrompt';
import PlatformDistribution from '../components/collective/PlatformDistribution';
import ReasonDistribution from '../components/collective/ReasonDistribution';
import TrendChart from '../components/collective/TrendChart';

export default function CollectiveInsightsPage() {
  const { data: reports = [], isLoading } = useGetCollectiveReports();
  
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [regionFilter, setRegionFilter] = useState<Region | 'all'>('all');
  const [reasonFilter, setReasonFilter] = useState<ReasonCategory | 'all'>('all');

  const filteredReports = reports.filter(report => {
    if (platformFilter !== 'all' && report.platform !== platformFilter) return false;
    if (regionFilter !== 'all' && report.region !== regionFilter) return false;
    if (reasonFilter !== 'all' && report.reason !== reasonFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Collective Insights</h1>
        <p className="text-muted-foreground">
          Anonymous data showing patterns of platform blocks in your region
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          All data is anonymous and aggregated. Help strengthen the community by sharing your experience.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredReports.length}</div>
            <p className="text-xs text-muted-foreground">Anonymous submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.length > 0 ? '+' + Math.round((filteredReports.length / reports.length) * 100) + '%' : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">Of total reports</p>
          </CardContent>
        </Card>
      </div>

      <CollectiveFilters
        platform={platformFilter}
        region={regionFilter}
        reason={reasonFilter}
        onPlatformChange={setPlatformFilter}
        onRegionChange={setRegionFilter}
        onReasonChange={setReasonFilter}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <PlatformDistribution reports={filteredReports} />
        <ReasonDistribution reports={filteredReports} />
      </div>

      <TrendChart reports={filteredReports} />

      <CollectiveSharePrompt />
    </div>
  );
}
