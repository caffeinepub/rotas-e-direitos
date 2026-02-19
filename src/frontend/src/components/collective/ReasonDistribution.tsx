import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Platform, Region } from '../../types/backend-extended';
import { CollectiveReport, ReasonCategory } from '../../types/backend-extended';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ReasonDistributionProps {
  reports: CollectiveReport[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

const reasonLabels: Record<ReasonCategory, string> = {
  [ReasonCategory.documentsExpired]: 'Documentos Vencidos',
  [ReasonCategory.selfieInvalid]: 'Selfie Inválida',
  [ReasonCategory.lowRating]: 'Avaliação Baixa',
  [ReasonCategory.dangerousConduct]: 'Conduta Perigosa',
  [ReasonCategory.fraudSuspicion]: 'Suspeita de Fraude',
  [ReasonCategory.multipleAccounts]: 'Múltiplas Contas',
  [ReasonCategory.other]: 'Outro',
};

export default function ReasonDistribution({ reports }: ReasonDistributionProps) {
  const reasonCounts = reports.reduce((acc, report) => {
    acc[report.reason] = (acc[report.reason] || 0) + 1;
    return acc;
  }, {} as Record<ReasonCategory, number>);

  const data = Object.entries(reasonCounts).map(([reason, count]) => ({
    name: reasonLabels[reason as ReasonCategory],
    value: count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Motivo</CardTitle>
        <CardDescription>Motivos mais comuns de bloqueio</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
      </CardContent>
    </Card>
  );
}
