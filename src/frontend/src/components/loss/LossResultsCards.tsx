import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Loss</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {weeklyLoss.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Per week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Loss</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {monthlyLoss.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Per month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Accumulated Loss</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {accumulatedLoss.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Since deactivation</p>
        </CardContent>
      </Card>
    </div>
  );
}
