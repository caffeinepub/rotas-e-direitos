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
        <CardTitle>90-Day Loss Projection</CardTitle>
        <CardDescription>Projected earnings loss over the next 90 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="days" label={{ value: 'Days', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Loss (R$)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
            <Line type="monotone" dataKey="loss" stroke="hsl(var(--destructive))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
