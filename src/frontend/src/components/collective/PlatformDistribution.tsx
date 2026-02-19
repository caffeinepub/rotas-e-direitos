import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Platform, Region } from '../../types/backend-extended';
import { CollectiveReport } from '../../types/backend-extended';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface PlatformDistributionProps {
  reports: CollectiveReport[];
}

export default function PlatformDistribution({ reports }: PlatformDistributionProps) {
  const platformCounts = reports.reduce((acc, report) => {
    acc[report.platform] = (acc[report.platform] || 0) + 1;
    return acc;
  }, {} as Record<Platform, number>);

  const data = Object.entries(platformCounts).map(([platform, count]) => ({
    platform,
    count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Plataforma</CardTitle>
        <CardDescription>Número de relatos por plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="platform" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="hsl(var(--primary))" name="Relatos" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
