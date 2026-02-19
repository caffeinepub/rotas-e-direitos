import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Platform, Region } from '../types/backend-extended';
import { ReasonCategory } from '../types/backend-extended';
import { useGetCollectiveReports } from '../hooks/useCollectiveReports';
import CollectiveFilters from '../components/collective/CollectiveFilters';
import PlatformDistribution from '../components/collective/PlatformDistribution';
import ReasonDistribution from '../components/collective/ReasonDistribution';
import TrendChart from '../components/collective/TrendChart';
import CollectiveSharePrompt from '../components/collective/CollectiveSharePrompt';
import { Info } from 'lucide-react';

export default function CollectiveInsightsPage() {
  const { data: reports = [], isLoading } = useGetCollectiveReports();
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [regionFilter, setRegionFilter] = useState<Region | 'all'>('all');
  const [reasonFilter, setReasonFilter] = useState<ReasonCategory | 'all'>('all');

  const filteredReports = reports.filter((report) => {
    if (platformFilter !== 'all' && report.platform !== platformFilter) return false;
    if (regionFilter !== 'all' && report.region !== regionFilter) return false;
    if (reasonFilter !== 'all' && report.reason !== reasonFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dados Coletivos</h1>
        <p className="text-muted-foreground">
          Insights anônimos da comunidade de entregadores
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Todos os dados são anônimos e agregados. Compartilhe sua experiência para ajudar a
          comunidade.
        </AlertDescription>
      </Alert>

      <CollectiveFilters
        platformFilter={platformFilter}
        regionFilter={regionFilter}
        reasonFilter={reasonFilter}
        onPlatformChange={setPlatformFilter}
        onRegionChange={setRegionFilter}
        onReasonChange={setReasonFilter}
      />

      {isLoading ? (
        <Card>
          <CardHeader>
            <CardTitle>Carregando dados...</CardTitle>
          </CardHeader>
        </Card>
      ) : filteredReports.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum dado disponível</CardTitle>
            <CardDescription>
              Seja o primeiro a compartilhar sua experiência com a comunidade
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <PlatformDistribution reports={filteredReports} />
          <ReasonDistribution reports={filteredReports} />
          <div className="md:col-span-2">
            <TrendChart reports={filteredReports} />
          </div>
        </div>
      )}

      <CollectiveSharePrompt />
    </div>
  );
}
