import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CollectiveReport } from '../../types/backend-extended';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendChartProps {
  reports: CollectiveReport[];
}

export default function TrendChart({ reports }: TrendChartProps) {
  const sortedReports = [...reports].sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

  const monthlyData = sortedReports.reduce((acc, report) => {
    const date = new Date(Number(report.timestamp) / 1000000);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    acc[monthKey] = (acc[monthKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendência Temporal</CardTitle>
        <CardDescription>Evolução dos relatos ao longo do tempo</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-border dark:stroke-border/50"
            />
            <XAxis 
              dataKey="month"
              className="text-muted-foreground"
              stroke="currentColor"
            />
            <YAxis 
              className="text-muted-foreground"
              stroke="currentColor"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
