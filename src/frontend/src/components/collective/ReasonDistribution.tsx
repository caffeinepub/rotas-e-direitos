import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Platform, Region } from '../../backend';
import { ReasonCategory, CollectiveReport } from '../../types/backend-extended';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ReasonDistributionProps {
  reports: CollectiveReport[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

export default function ReasonDistribution({ reports }: ReasonDistributionProps) {
  const reasonCounts = reports.reduce((acc, report) => {
    const reason = report.reason;
    acc[reason] = (acc[reason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(reasonCounts).map(([reason, count]) => ({
    name: reason.replace(/([A-Z])/g, ' $1').trim(),
    value: count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blocks by Reason</CardTitle>
        <CardDescription>Distribution of block reasons</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
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
