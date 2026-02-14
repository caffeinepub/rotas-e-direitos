import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Platform, Region } from '../../backend';
import { ReasonCategory, CollectiveReport } from '../../types/backend-extended';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendChartProps {
  reports: CollectiveReport[];
}

export default function TrendChart({ reports }: TrendChartProps) {
  // Group reports by date
  const reportsByDate = reports.reduce((acc, report) => {
    const date = new Date(Number(report.timestamp)).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(reportsByDate)
    .map(([date, count]) => ({
      date,
      count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Block Trend Over Time</CardTitle>
        <CardDescription>Number of reported blocks per day</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
