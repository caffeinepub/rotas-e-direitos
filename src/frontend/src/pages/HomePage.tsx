import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calculator, MessageSquare, BarChart3, ArrowRight, Shield, Users, TrendingUp } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const features = [
    {
      to: '/evidencias',
      title: 'Rastreador de Evidências',
      description: 'Organize selfies diárias, prints de avaliações e registre condições de trabalho',
      icon: FileText,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      to: '/calculadora',
      title: 'Calculadora de Perdas',
      description: 'Calcule o prejuízo financeiro causado pela desativação injusta',
      icon: Calculator,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
    {
      to: '/recursos',
      title: 'Gerador de Recursos',
      description: 'Crie recursos profissionais para contestar desativações',
      icon: MessageSquare,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
    {
      to: '/dados-coletivos',
      title: 'Dados Coletivos',
      description: 'Veja estatísticas anônimas de desativações na sua região',
      icon: BarChart3,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Privacidade Garantida',
      description: 'Seus dados são protegidos e criptografados',
    },
    {
      icon: Users,
      title: 'Força Coletiva',
      description: 'Compartilhe dados anônimos para fortalecer a comunidade',
    },
    {
      icon: TrendingUp,
      title: 'Resultados Reais',
      description: 'Ferramentas práticas para defender seus direitos',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
          Rotas e Direitos
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
          Plataforma de apoio para trabalhadores de aplicativos de Fortaleza e região metropolitana
        </p>
        {!isAuthenticated && (
          <div className="pt-4">
            <p className="text-lg text-muted-foreground mb-4">
              Faça login para acessar todas as funcionalidades
            </p>
          </div>
        )}
      </div>

      {/* Main Features */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Ferramentas Disponíveis
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.to} to={feature.to}>
                <Card className="h-full transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer border-border/60 group">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${feature.bgColor} ${feature.color} shadow-sm group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl flex items-center justify-between">
                          {feature.title}
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </CardTitle>
                        <CardDescription className="text-base mt-2">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Por Que Usar?
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <Card key={benefit.title} className="text-center border-border/60 shadow-md">
                <CardHeader>
                  <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  <CardDescription className="text-base">
                    {benefit.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      {isAuthenticated ? (
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 shadow-lg">
          <CardContent className="pt-6 text-center space-y-4">
            <h3 className="text-2xl font-bold">Pronto para começar?</h3>
            <p className="text-lg text-muted-foreground">
              Acesse o dashboard para explorar todas as funcionalidades
            </p>
            <Button size="lg" asChild className="shadow-md">
              <Link to="/">
                Ir para Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 shadow-lg">
          <CardContent className="pt-6 text-center space-y-4">
            <h3 className="text-2xl font-bold">Comece Agora</h3>
            <p className="text-lg text-muted-foreground">
              Faça login com Internet Identity para acessar todas as ferramentas
            </p>
            <p className="text-sm text-muted-foreground">
              Seus dados são privados e protegidos pela tecnologia blockchain
            </p>
          </CardContent>
        </Card>
      )}

      {/* Important Notice */}
      <Card className="bg-accent/5 border-accent/20 shadow-sm">
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">
            <strong className="text-accent">Importante:</strong> Este aplicativo é uma iniciativa colaborativa criada para
            ajudar entregadores de Fortaleza-CE e região metropolitana. Todos os seus dados são privados e
            protegidos. Compartilhe apenas informações anônimas quando solicitado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
