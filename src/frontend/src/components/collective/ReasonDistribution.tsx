import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReasonCategory } from '../../types/backend-extended';
import { CollectiveReport } from '../../types/backend-extended';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ReasonDistributionProps {
  reports: CollectiveReport[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export default function ReasonDistribution({ reports }: ReasonDistributionProps) {
  const reasonCounts = reports.reduce((acc, report) => {
    acc[report.reason] = (acc[report.reason] || 0) + 1;
    return acc;
  }, {} as Record<ReasonCategory, number>);

  const data = Object.entries(reasonCounts).map(([reason, count]) => ({
    name: reason,
    value: count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Motivo</CardTitle>
        <CardDescription>Motivos mais comuns de desativação</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="hsl(var(--primary))"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))',
              }}
            />
            <Legend 
              wrapperStyle={{
                color: 'hsl(var(--foreground))',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
