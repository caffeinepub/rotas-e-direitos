import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Platform, Region } from '../../types/backend-extended';
import { CollectiveReport } from '../../types/backend-extended';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TrendChartProps {
  reports: CollectiveReport[];
}

export default function TrendChart({ reports }: TrendChartProps) {
  // Group reports by month
  const monthlyData = reports.reduce((acc, report) => {
    const date = new Date(Number(report.timestamp));
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    acc[monthKey] = (acc[monthKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      month,
      count,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendência ao Longo do Tempo</CardTitle>
        <CardDescription>Número de relatos por mês</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" name="Relatos" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
