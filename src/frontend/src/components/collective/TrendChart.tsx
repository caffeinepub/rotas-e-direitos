import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetCollectiveReports } from '../../hooks/useCollectiveReports';
import { Platform, ReasonCategory, Region } from '../../backend';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';

interface TrendChartProps {
  platformFilter: Platform | null;
  reasonFilter: ReasonCategory | null;
  regionFilter: Region | null;
  periodDays: number;
}

export default function TrendChart({ platformFilter, reasonFilter, regionFilter, periodDays }: TrendChartProps) {
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

  const dailyCounts: Record<string, number> = {};
  const today = startOfDay(new Date());

  for (let i = periodDays - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const key = format(date, 'yyyy-MM-dd');
    dailyCounts[key] = 0;
  }

  filtered.forEach((r) => {
    const date = startOfDay(new Date(Number(r.timestamp) / 1000000));
    const key = format(date, 'yyyy-MM-dd');
    if (dailyCounts[key] !== undefined) {
      dailyCounts[key]++;
    }
  });

  const data = Object.entries(dailyCounts).map(([date, count]) => ({
    date: format(new Date(date), 'dd/MM', { locale: ptBR }),
    count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Tendência ao Longo do Tempo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-sm" />
            <YAxis className="text-sm" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Line type="monotone" dataKey="count" stroke="hsl(var(--chart-3))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
