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
      description: 'Instant payment via QR Code',
      color: 'text-chart-1',
    },
    {
      icon: CreditCard,
      title: 'Credit Card',
      description: 'Pay in up to 12 interest-free installments',
      color: 'text-chart-2',
    },
    {
      icon: FileText,
      title: 'Bank Slip',
      description: 'Payment via boleto with 3-day expiry',
      color: 'text-chart-3',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Payments</h1>
        <p className="text-xl text-muted-foreground">
          Choose the most convenient payment method for you
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
          <CardTitle className="text-2xl">Ready to Subscribe?</CardTitle>
          <CardDescription className="text-base">
            Choose your plan and select the payment method in the next step. PIX provider selection is available during checkout.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full md:w-auto" onClick={() => navigate({ to: '/planos' })}>
            View Available Plans
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      <TrustBadges />

      <Card className="bg-accent/50">
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold text-lg">Important Information</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• All payments are processed securely</li>
            <li>• You will receive a receipt by email after confirmation</li>
            <li>• Cancel your subscription at any time</li>
            <li>• Support available for payment questions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
