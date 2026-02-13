import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetCollectiveReports } from '../../hooks/useCollectiveReports';
import { Platform, ReasonCategory, Region } from '../../backend';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';

interface PlatformDistributionProps {
  platformFilter: Platform | null;
  reasonFilter: ReasonCategory | null;
  regionFilter: Region | null;
  periodDays: number;
}

const platformLabels: Record<Platform, string> = {
  [Platform.ifood]: 'iFood',
  [Platform.uber]: 'Uber',
  [Platform.rappi]: 'Rappi',
  [Platform.ninetyNine]: '99',
};

const platformColors: Record<Platform, string> = {
  [Platform.ifood]: 'hsl(var(--chart-1))',
  [Platform.uber]: 'hsl(var(--chart-2))',
  [Platform.rappi]: 'hsl(var(--chart-3))',
  [Platform.ninetyNine]: 'hsl(var(--chart-4))',
};

export default function PlatformDistribution({
  platformFilter,
  reasonFilter,
  regionFilter,
  periodDays,
}: PlatformDistributionProps) {
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

  const counts: Record<Platform, number> = {
    [Platform.ifood]: 0,
    [Platform.uber]: 0,
    [Platform.rappi]: 0,
    [Platform.ninetyNine]: 0,
  };

  filtered.forEach((r) => {
    counts[r.platform]++;
  });

  const data = Object.entries(counts).map(([platform, count]) => ({
    platform: platformLabels[platform as Platform],
    count,
    color: platformColors[platform as Platform],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Distribuição por Plataforma</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="platform" className="text-sm" />
            <YAxis className="text-sm" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
