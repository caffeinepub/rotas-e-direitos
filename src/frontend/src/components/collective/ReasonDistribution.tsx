import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetCollectiveReports } from '../../hooks/useCollectiveReports';
import { Platform, ReasonCategory, Region } from '../../backend';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

interface ReasonDistributionProps {
  platformFilter: Platform | null;
  reasonFilter: ReasonCategory | null;
  regionFilter: Region | null;
  periodDays: number;
}

const reasonLabels: Record<ReasonCategory, string> = {
  [ReasonCategory.documentsExpired]: 'Documentos',
  [ReasonCategory.selfieInvalid]: 'Selfie',
  [ReasonCategory.lowRating]: 'Avaliação',
  [ReasonCategory.dangerousConduct]: 'Conduta',
  [ReasonCategory.fraudSuspicion]: 'Fraude',
  [ReasonCategory.multipleAccounts]: 'Múltiplas Contas',
  [ReasonCategory.other]: 'Outro',
};

export default function ReasonDistribution({
  platformFilter,
  reasonFilter,
  regionFilter,
  periodDays,
}: ReasonDistributionProps) {
  const { data: reports = [], isLoading } = useGetCollectiveReports();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const cutoffTime = Date.now() - periodDays * 24 * 60 * 60 * 1000;
  const filtered = reports.filter((r) => {
    const time = Number(r.timestamp) / 1000000;
    if (time < cutoffTime) return false;
    if (platformFilter && r.platform !== platformFilter) return false;
    if (reasonFilter && r.reason !== reasonFilter) return false;
    if (regionFilter && r.region !== regionFilter) return false;
    return true;
  });

  const counts: Record<ReasonCategory, number> = {
    [ReasonCategory.documentsExpired]: 0,
    [ReasonCategory.selfieInvalid]: 0,
    [ReasonCategory.lowRating]: 0,
    [ReasonCategory.dangerousConduct]: 0,
    [ReasonCategory.fraudSuspicion]: 0,
    [ReasonCategory.multipleAccounts]: 0,
    [ReasonCategory.other]: 0,
  };

  filtered.forEach((r) => {
    counts[r.reason]++;
  });

  const data = Object.entries(counts)
    .map(([reason, count]) => ({
      reason: reasonLabels[reason as ReasonCategory],
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Distribuição por Motivo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-sm" />
            <YAxis dataKey="reason" type="category" width={100} className="text-sm" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
