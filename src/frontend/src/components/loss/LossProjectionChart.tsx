import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicLossProfile } from '../../types/backend-extended';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateProjectedLoss } from '../../lib/lossCalculations';

interface LossProjectionChartProps {
  profile: PublicLossProfile;
}

export default function LossProjectionChart({ profile }: LossProjectionChartProps) {
  const data: Array<{ days: number; loss: number }> = [];
  for (let days = 0; days <= 90; days += 10) {
    data.push({
      days,
      loss: calculateProjectedLoss(profile, days),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projeção de Perdas (90 dias)</CardTitle>
        <CardDescription>Projeção de prejuízo financeiro nos próximos 90 dias</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-border dark:stroke-border/50"
            />
            <XAxis 
              dataKey="days" 
              label={{ value: 'Dias', position: 'insideBottom', offset: -5 }}
              className="text-muted-foreground"
              stroke="currentColor"
            />
            <YAxis 
              label={{ value: 'Perda (R$)', angle: -90, position: 'insideLeft' }}
              className="text-muted-foreground"
              stroke="currentColor"
            />
            <Tooltip 
              formatter={(value: number) => `R$ ${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))',
              }}
              labelStyle={{ color: 'hsl(var(--popover-foreground))' }}
            />
            <Line 
              type="monotone" 
              dataKey="loss" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--destructive))', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
