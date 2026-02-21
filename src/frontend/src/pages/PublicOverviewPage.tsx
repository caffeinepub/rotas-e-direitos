import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Calculator, 
  FileText, 
  Users, 
  Shield, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  ArrowRight,
  Star
} from 'lucide-react';
import MarketingBanner from '../components/marketing/MarketingBanner';
import TestimonialsSection from '../components/testimonials/TestimonialsSection';
import PlanComparisonMatrix from '../components/subscription/PlanComparisonMatrix';
import { useHomepageStyleVariant } from '../hooks/useHomepageStyleVariant';

export default function PublicOverviewPage() {
  const navigate = useNavigate();
  const { variant, toggleVariant } = useHomepageStyleVariant();

  const features = [
    {
      icon: Camera,
      title: 'Rastreador de Evidências',
      description: 'Organize selfies diárias, prints de avaliações e registre condições de trabalho em tempo real',
      benefits: ['Captura rápida', 'Organização automática', 'Backup seguro'],
    },
    {
      icon: Calculator,
      title: 'Calculadora de Perdas',
      description: 'Calcule o prejuízo financeiro causado pela desativação injusta da sua conta',
      benefits: ['Cálculo preciso', 'Relatórios detalhados', 'Exportação PDF'],
    },
    {
      icon: FileText,
      title: 'Gerador de Recursos',
      description: 'Crie recursos profissionais para contestar desativações de forma eficaz',
      benefits: ['Templates prontos', 'Personalização fácil', 'Envio por email'],
    },
    {
      icon: Users,
      title: 'Dados Coletivos',
      description: 'Veja estatísticas anônimas de desativações na sua região e fortaleça a comunidade',
      benefits: ['Insights regionais', 'Tendências', 'Força coletiva'],
    },
  ];

  const getVariantStyles = () => {
    switch (variant) {
      case 'A':
        return {
          heroGradient: 'from-primary/20 via-secondary/10 to-accent/20',
          featureCardBg: 'bg-card',
          featureCardBorder: 'border-border',
          ctaBg: 'bg-gradient-to-r from-primary to-secondary',
        };
      case 'B':
        return {
          heroGradient: 'from-blue-500/20 via-purple-500/10 to-pink-500/20',
          featureCardBg: 'bg-gradient-to-br from-card to-accent/5',
          featureCardBorder: 'border-accent/20',
          ctaBg: 'bg-gradient-to-r from-blue-600 to-purple-600',
        };
      case 'C':
        return {
          heroGradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20',
          featureCardBg: 'bg-card/50 backdrop-blur-sm',
          featureCardBorder: 'border-emerald-500/20',
          ctaBg: 'bg-gradient-to-r from-emerald-600 to-teal-600',
        };
      default:
        return {
          heroGradient: 'from-primary/20 via-secondary/10 to-accent/20',
          featureCardBg: 'bg-card',
          featureCardBorder: 'border-border',
          ctaBg: 'bg-gradient-to-r from-primary to-secondary',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="space-y-16">
      {/* Style Variant Toggle (Dev Tool) */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={toggleVariant}
          variant="outline"
          size="sm"
          className="shadow-lg"
        >
          Style: {variant}
        </Button>
      </div>

      {/* Marketing Banner */}
      <MarketingBanner />

      {/* Hero Section */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${styles.heroGradient} p-8 md:p-12 shadow-xl`}>
        <div className="relative z-10 text-center space-y-6">
          <div className="flex justify-center mb-6">
            <img 
              src="/assets/generated/nova-logo.dim_256x256.png" 
              alt="Nova Logo" 
              className="h-32 w-auto object-contain"
            />
          </div>
          <Badge variant="secondary" className="mb-4">
            Plataforma Gratuita para Trabalhadores de App
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Rotas e Direitos
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Ferramentas essenciais para trabalhadores de aplicativos de Fortaleza e região metropolitana
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate({ to: '/dashboard' })}
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Saiba Mais
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Ferramentas Poderosas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tudo que você precisa para defender seus direitos e organizar suas evidências
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title} 
                className={`${styles.featureCardBg} ${styles.featureCardBorder} shadow-lg hover:shadow-xl transition-all`}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {feature.benefits.map((benefit) => (
                      <Badge key={benefit} variant="secondary" className="text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Plan Comparison Section */}
      <div className="py-8">
        <PlanComparisonMatrix />
      </div>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Security & Trust */}
      <div className="space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Segurança e Privacidade
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="text-center shadow-md">
            <CardHeader>
              <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Dados Protegidos</CardTitle>
              <CardDescription className="text-base">
                Criptografia de ponta a ponta para suas informações
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center shadow-md">
            <CardHeader>
              <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Comunidade Forte</CardTitle>
              <CardDescription className="text-base">
                Dados coletivos anônimos para fortalecer a luta
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="text-center shadow-md">
            <CardHeader>
              <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Resultados Comprovados</CardTitle>
              <CardDescription className="text-base">
                Ferramentas que realmente ajudam a reverter desativações
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Final CTA */}
      <Card className={`${styles.ctaBg} text-white shadow-xl`}>
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Pronto para Defender Seus Direitos?
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Junte-se a centenas de trabalhadores que já estão usando nossas ferramentas
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate({ to: '/dashboard' })}
            className="shadow-lg hover:shadow-xl transition-shadow"
          >
            Começar Gratuitamente
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
