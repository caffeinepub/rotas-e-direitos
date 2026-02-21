import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicLossProfile } from '../../types/backend-extended';
import { calculateWeeklyLoss, calculateMonthlyLoss, calculateAccumulatedLoss } from '../../lib/lossCalculations';
import { TrendingDown, Calendar, DollarSign } from 'lucide-react';

interface LossResultsCardsProps {
  profile: PublicLossProfile;
}

export default function LossResultsCards({ profile }: LossResultsCardsProps) {
  const weeklyLoss = calculateWeeklyLoss(profile);
  const monthlyLoss = calculateMonthlyLoss(profile);
  const accumulatedLoss = calculateAccumulatedLoss(profile);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-destructive/20 dark:border-destructive/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Perda Semanal</CardTitle>
          <Calendar className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">R$ {weeklyLoss.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">Por semana</p>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 dark:border-destructive/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Perda Mensal</CardTitle>
          <TrendingDown className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">R$ {monthlyLoss.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">Por mês</p>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 dark:border-destructive/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Perda Acumulada</CardTitle>
          <DollarSign className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">R$ {accumulatedLoss.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">Desde a desativação</p>
        </CardContent>
      </Card>
    </div>
  );
}
