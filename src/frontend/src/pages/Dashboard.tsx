import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calculator, MessageSquare, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const modules = [
    {
      to: '/evidencias',
      title: 'Rastreador de Evidências',
      description: 'Organize selfies diárias, prints de avaliações e registre condições de trabalho',
      icon: FileText,
      color: 'text-chart-1',
    },
    {
      to: '/calculadora',
      title: 'Calculadora de Perdas',
      description: 'Calcule o prejuízo financeiro causado pela desativação injusta',
      icon: Calculator,
      color: 'text-chart-2',
    },
    {
      to: '/recursos',
      title: 'Gerador de Recursos',
      description: 'Crie recursos profissionais para contestar desativações',
      icon: MessageSquare,
      color: 'text-chart-3',
    },
    {
      to: '/dados-coletivos',
      title: 'Dados Coletivos',
      description: 'Veja estatísticas anônimas de desativações na sua região',
      icon: BarChart3,
      color: 'text-chart-4',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Painel Principal</h1>
        <p className="text-xl text-muted-foreground">
          Ferramenta gratuita para defender seus direitos como entregador
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Link key={module.to} to={module.to}>
              <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-accent ${module.color}`}>
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

      <Card className="bg-accent/50">
        <CardContent className="pt-6">
          <p className="text-base leading-relaxed">
            <strong>Importante:</strong> Este aplicativo é uma iniciativa colaborativa e gratuita criada para
            ajudar entregadores de Fortaleza-CE e região metropolitana. Todos os seus dados são privados e
            protegidos. Compartilhe apenas informações anônimas quando solicitado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
