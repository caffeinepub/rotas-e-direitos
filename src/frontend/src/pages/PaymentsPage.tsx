import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, QrCode, FileText, ArrowRight } from 'lucide-react';
import TrustBadges from '../components/trust/TrustBadges';

export default function PaymentsPage() {
  const navigate = useNavigate();

  const paymentMethods = [
    {
      icon: QrCode,
      title: 'PIX',
      description: 'Pagamento instantâneo via QR Code',
      color: 'text-chart-1',
    },
    {
      icon: CreditCard,
      title: 'Cartão de Crédito',
      description: 'Parcelamento em até 12x sem juros',
      color: 'text-chart-2',
    },
    {
      icon: FileText,
      title: 'Boleto Bancário',
      description: 'Pagamento via boleto com vencimento em 3 dias',
      color: 'text-chart-3',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Pagamentos</h1>
        <p className="text-xl text-muted-foreground">
          Escolha a forma de pagamento mais conveniente para você
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <Card key={method.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center space-y-4">
                <div className={`mx-auto w-16 h-16 rounded-full bg-accent flex items-center justify-center ${method.color}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">{method.title}</CardTitle>
                <CardDescription>{method.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="text-2xl">Pronto para Assinar?</CardTitle>
          <CardDescription className="text-base">
            Escolha seu plano e selecione a forma de pagamento no próximo passo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full md:w-auto" onClick={() => navigate({ to: '/planos' })}>
            Ver Planos Disponíveis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      <TrustBadges />

      <Card className="bg-accent/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold text-lg">Informações Importantes</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Todos os pagamentos são processados de forma segura</li>
            <li>• Você receberá um recibo por e-mail após a confirmação</li>
            <li>• Cancele sua assinatura a qualquer momento</li>
            <li>• Suporte disponível para dúvidas sobre pagamento</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
