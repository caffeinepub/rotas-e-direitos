import AuthGate from '../components/AuthGate';
import LossProfileForm from '../components/loss/LossProfileForm';
import LossResultsCards from '../components/loss/LossResultsCards';
import LossProjectionChart from '../components/loss/LossProjectionChart';
import LossReportActions from '../components/loss/LossReportActions';
import { useGetCallerLossProfile } from '../hooks/useLossProfile';
import { Card, CardContent } from '@/components/ui/card';

export default function LossCalculatorPage() {
  const { data: profile } = useGetCallerLossProfile();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Calculadora de Perdas</h1>
        <p className="text-xl text-muted-foreground">
          Calcule o prejuízo financeiro causado pela desativação
        </p>
      </div>

      <AuthGate message="Entre para calcular suas perdas financeiras e gerar relatórios.">
        <div className="space-y-6">
          <LossProfileForm />

          {profile ? (
            <>
              <LossResultsCards profile={profile} />
              <LossProjectionChart profile={profile} />
              <Card>
                <CardContent className="pt-6">
                  <LossReportActions profile={profile} />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">
                  Preencha o formulário acima para ver os cálculos de perdas
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </AuthGate>
    </div>
  );
}
