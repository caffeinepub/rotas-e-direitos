import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicLossProfile } from '../../backend';
import { calculateLosses } from '../../lib/lossCalculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LossProjectionChartProps {
  profile: PublicLossProfile;
}

export default function LossProjectionChart({ profile }: LossProjectionChartProps) {
  const losses = calculateLosses(profile);

  const data = [
    { period: '30 dias', value: losses.projection30 },
    { period: '60 dias', value: losses.projection60 },
    { period: '90 dias', value: losses.projection90 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Projeção de Perdas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="period" className="text-sm" />
            <YAxis className="text-sm" />
            <Tooltip
              formatter={(value: number) =>
                new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(value)
              }
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
