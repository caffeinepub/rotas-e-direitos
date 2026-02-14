import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calculator, MessageSquare, BarChart3, Shield, Lock } from 'lucide-react';
import TrustBadges from '../components/trust/TrustBadges';

export default function PublicOverviewPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: 'Rastreador de Evidências',
      description: 'Organize e armazene evidências de forma segura para defender seus direitos',
    },
    {
      icon: Calculator,
      title: 'Calculadora de Perdas',
      description: 'Calcule o prejuízo financeiro causado por desativações injustas',
    },
    {
      icon: MessageSquare,
      title: 'Gerador de Recursos',
      description: 'Crie recursos profissionais automaticamente para contestar desativações',
    },
    {
      icon: BarChart3,
      title: 'Dados Coletivos',
      description: 'Acesse estatísticas anônimas sobre desativações na sua região',
    },
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      <div className="text-center space-y-6 py-12">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          ROTAS E DIREITOS
        </h1>
        <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
          Ferramenta completa para entregadores defenderem seus direitos contra desativações injustas
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" className="text-lg px-8" onClick={() => navigate({ to: '/planos' })}>
            Ver Planos
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate({ to: '/privacidade' })}>
            Saiba Mais
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base mt-2">{feature.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card className="border-primary/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Segurança e Privacidade</CardTitle>
          <CardDescription className="text-base">
            Seus dados são protegidos com tecnologia blockchain de ponta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Dados Criptografados</h3>
                <p className="text-sm text-muted-foreground">
                  Todas as suas informações são armazenadas de forma segura e criptografada
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="h-6 w-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Privacidade Garantida</h3>
                <p className="text-sm text-muted-foreground">
                  Você controla seus dados. Compartilhamento apenas com seu consentimento
                </p>
              </div>
            </div>
          </div>
          <TrustBadges />
        </CardContent>
      </Card>

      <Card className="bg-accent/50">
        <CardContent className="pt-6 text-center">
          <p className="text-lg leading-relaxed max-w-3xl mx-auto">
            Junte-se a centenas de entregadores que já estão usando o ROTAS E DIREITOS para
            organizar evidências, calcular perdas e gerar recursos profissionais.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
