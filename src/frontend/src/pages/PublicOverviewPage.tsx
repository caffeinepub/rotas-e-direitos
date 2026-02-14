import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calculator, MessageSquare, BarChart3, Shield, Lock, Palette } from 'lucide-react';
import TrustBadges from '../components/trust/TrustBadges';
import MarketingBanner from '../components/marketing/MarketingBanner';
import TestimonialsSection from '../components/testimonials/TestimonialsSection';
import { useHomepageStyleVariant } from '../hooks/useHomepageStyleVariant';

export default function PublicOverviewPage() {
  const navigate = useNavigate();
  const { variant, toggleVariant } = useHomepageStyleVariant();

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

  const containerClass = variant === 'B' ? 'home-style-b' : variant === 'C' ? 'home-style-c' : '';

  return (
    <div className={`space-y-12 max-w-6xl mx-auto ${containerClass}`}>
      {/* Style Toggle Control */}
      <div className="flex justify-end pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleVariant}
          className="gap-2"
          aria-label={`Alternar para Estilo ${variant === 'A' ? 'B' : variant === 'B' ? 'C' : 'A'}`}
        >
          <Palette className="h-4 w-4" />
          Estilo {variant}
        </Button>
      </div>

      <div className={`text-center space-y-6 ${variant === 'B' ? 'py-16' : 'py-12'}`}>
        <h1 className={`font-bold tracking-tight ${variant === 'B' ? 'text-6xl md:text-7xl' : 'text-5xl md:text-6xl'}`}>
          ROTAS E DIREITOS
        </h1>
        <p className={`text-muted-foreground max-w-3xl mx-auto ${variant === 'B' ? 'text-xl' : 'text-2xl'}`}>
          Ferramenta completa para entregadores defenderem seus direitos contra desativações injustas
        </p>
        <div className={`flex flex-col sm:flex-row gap-4 justify-center ${variant === 'B' ? 'pt-6' : 'pt-4'}`}>
          <Button size="lg" className="text-lg px-8" onClick={() => navigate({ to: '/planos' })}>
            Ver Planos
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate({ to: '/privacidade' })}>
            Saiba Mais
          </Button>
        </div>
      </div>

      {/* Marketing Banner - Now Dynamic and Clickable */}
      <MarketingBanner variant={variant} />

      <div className={`grid gap-8 md:grid-cols-2 ${variant === 'B' ? 'gap-10' : ''}`}>
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className={variant === 'B' ? 'border-2' : ''}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-primary/10 ${variant === 'B' ? 'ring-2 ring-primary/20' : ''}`}>
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

      {/* User Testimonials Section */}
      <div className={variant === 'B' ? 'py-8' : ''}>
        <TestimonialsSection />
      </div>

      <Card className={`border-primary/50 ${variant === 'B' ? 'border-2 shadow-lg' : ''}`}>
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

      <Card className={`bg-accent/50 ${variant === 'B' ? 'border-2 border-accent' : ''}`}>
        <CardContent className={`text-center ${variant === 'B' ? 'pt-8 pb-8' : 'pt-6'}`}>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto">
            Junte-se a centenas de entregadores que já estão usando o ROTAS E DIREITOS para
            organizar evidências, calcular perdas e gerar recursos profissionais.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
