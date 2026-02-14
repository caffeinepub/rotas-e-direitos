import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Platform, Region } from '../../backend';
import { ReasonCategory, CollectiveReport } from '../../types/backend-extended';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PlatformDistributionProps {
  reports: CollectiveReport[];
}

export default function PlatformDistribution({ reports }: PlatformDistributionProps) {
  const platformCounts = reports.reduce((acc, report) => {
    const platform = report.platform;
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(platformCounts).map(([platform, count]) => ({
    platform: platform === 'ninetyNine' ? '99' : platform,
    count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blocks by Platform</CardTitle>
        <CardDescription>Distribution of reported blocks across platforms</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
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
