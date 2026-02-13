import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calculator, MessageSquare, BarChart3, ShieldCheck } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function PublicOverviewPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  const modules = [
    {
      title: 'Rastreador de Evidências',
      description:
        'Organize e armazene selfies diárias, prints de avaliações e registre automaticamente condições climáticas durante suas jornadas de trabalho.',
      icon: FileText,
    },
    {
      title: 'Calculadora de Perdas',
      description:
        'Calcule automaticamente o prejuízo financeiro causado pela desativação injusta, com projeções de 30, 60 e 90 dias.',
      icon: Calculator,
    },
    {
      title: 'Gerador de Recursos',
      description:
        'Crie recursos profissionais e bem fundamentados para contestar desativações, com templates específicos para cada plataforma.',
      icon: MessageSquare,
    },
    {
      title: 'Dados Coletivos',
      description:
        'Acesse estatísticas anônimas de desativações em Fortaleza e região, ajudando a fortalecer ações coletivas.',
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <img
          src="/assets/generated/logo-rotas-e-direitos.dim_512x512.png"
          alt="ROTAS E DIREITOS"
          className="h-24 w-24 mx-auto"
        />
        <h1 className="text-5xl font-bold tracking-tight">ROTAS E DIREITOS</h1>
        <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
          Ferramenta gratuita para defender entregadores de aplicativo contra desativações injustas
        </p>
        <div className="pt-4">
          <Button onClick={login} disabled={isLoggingIn} size="lg" className="text-lg h-14 px-8">
            {isLoggingIn ? 'Entrando...' : 'Entrar para Começar'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.title}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{module.title}</CardTitle>
                    <CardDescription className="text-base mt-2">{module.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card className="bg-accent/50">
        <CardHeader>
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-8 w-8 text-chart-1" />
            <div>
              <CardTitle className="text-2xl">Seus Dados São Protegidos</CardTitle>
              <CardDescription className="text-base mt-2">
                Todas as suas evidências e informações pessoais ficam armazenadas de forma segura e privada.
                Apenas você tem acesso aos seus dados. Quando você optar por compartilhar informações para
                estatísticas coletivas, apenas dados anônimos (plataforma, região, motivo) são enviados - nunca
                seu nome, fotos ou documentos.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Pronto para Defender Seus Direitos?</h2>
        <p className="text-lg text-muted-foreground">
          Junte-se a centenas de entregadores que já estão usando o ROTAS E DIREITOS
        </p>
        <Button onClick={login} disabled={isLoggingIn} size="lg" className="text-lg h-14 px-8">
          {isLoggingIn ? 'Entrando...' : 'Criar Conta Gratuita'}
        </Button>
        <p className="text-sm text-muted-foreground pt-2">
          <Link to="/dados-coletivos" className="underline hover:text-foreground">
            Ver estatísticas públicas
          </Link>
        </p>
      </div>
    </div>
  );
}
