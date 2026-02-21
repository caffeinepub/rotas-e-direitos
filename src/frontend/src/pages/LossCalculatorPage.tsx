import AuthGate from '../components/AuthGate';
import LossProfileForm from '../components/loss/LossProfileForm';
import LossResultsCards from '../components/loss/LossResultsCards';
import LossProjectionChart from '../components/loss/LossProjectionChart';
import LossReportActions from '../components/loss/LossReportActions';
import { useGetCallerLossProfile } from '../hooks/useLossProfile';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

export default function LossCalculatorPage() {
  const { data: profile, isLoading } = useGetCallerLossProfile();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive">
            <Calculator className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Calculadora de Perdas</h1>
            <p className="text-xl text-muted-foreground">
              Calcule o prejuízo financeiro causado pela desativação
            </p>
          </div>
        </div>
      </div>

      <AuthGate message="Entre para calcular suas perdas financeiras e gerar relatórios.">
        <div className="space-y-6">
          <LossProfileForm />

          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">
                  Carregando...
                </p>
              </CardContent>
            </Card>
          ) : profile ? (
            <>
              <LossResultsCards profile={profile} />
              <LossProjectionChart profile={profile} />
              <Card className="border-primary/20 dark:border-primary/30">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Exportar Relatório</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Baixe um relatório completo em PDF com todos os cálculos de perdas ou compartilhe um resumo.
                      </p>
                    </div>
                    <LossReportActions profile={profile} />
                  </div>
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
