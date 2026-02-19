import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calculator, MessageSquare, BarChart3, CreditCard, User, Search } from 'lucide-react';

export default function Dashboard() {
  const modules = [
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

  const quickAccess = [
    {
      to: '/pagamentos',
      title: 'Pagamentos',
      icon: CreditCard,
    },
    {
      to: '/perfil',
      title: 'Perfil',
      icon: User,
    },
    {
      to: '/consulta-rapida',
      title: 'Consulta Rápida',
      icon: Search,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Painel Principal
        </h1>
        <p className="text-xl text-muted-foreground">
          Ferramenta para defender seus direitos como entregador
        </p>
      </div>

      <Card className="bg-gradient-to-br from-primary/8 to-accent/8 border-primary/20 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Acesso Rápido</CardTitle>
          <CardDescription>Atalhos para funcionalidades importantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {quickAccess.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.to}
                  variant="outline"
                  className="h-24 flex-col gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all"
                  asChild
                >
                  <Link to={item.to}>
                    <Icon className="h-6 w-6" />
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.to} to={module.to}>
              <Card className="h-full transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer border-border/60">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${module.bgColor} ${module.color} shadow-sm`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{module.title}</CardTitle>
                      <CardDescription className="text-base mt-2">{module.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

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
