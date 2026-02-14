import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Shield, FileText, Calculator, TrendingUp, Lock } from 'lucide-react';

export default function MarketingBanner() {
  const platforms = [
    { name: 'Uber', color: 'bg-foreground/90 text-background' },
    { name: '99', color: 'bg-primary/90 text-primary-foreground' },
    { name: 'iFood', color: 'bg-destructive/90 text-destructive-foreground' },
    { name: 'InDriver', color: 'bg-accent-foreground/90 text-accent' },
  ];

  const benefits = [
    {
      icon: FileText,
      title: 'Evidências Organizadas',
      description: 'Armazene e organize todas as provas de forma segura e acessível',
    },
    {
      icon: Calculator,
      title: 'Calculadora de Perdas',
      description: 'Calcule automaticamente seus prejuízos financeiros',
    },
    {
      icon: TrendingUp,
      title: 'Gerador de Recursos',
      description: 'Crie recursos profissionais para contestar desativações',
    },
    {
      icon: Shield,
      title: 'Dados Coletivos',
      description: 'Acesse estatísticas da sua região e fortaleça sua defesa',
    },
    {
      icon: Lock,
      title: 'Segurança Total',
      description: 'Seus dados protegidos com tecnologia blockchain',
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-background border-2 border-primary/30">
      {/* Background Images - Responsive */}
      <div className="absolute inset-0 opacity-10">
        <picture>
          <source media="(min-width: 768px)" srcSet="/assets/generated/banner-hero.dim_1600x600.png" />
          <img
            src="/assets/generated/banner-hero-mobile.dim_900x900.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </picture>
      </div>

      <div className="relative z-10 p-6 md:p-10 lg:p-12">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Defenda Seus Direitos
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Ferramenta completa para entregadores e motoristas de aplicativo
          </p>

          {/* Platform Badges */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <span className="text-sm text-muted-foreground self-center">Para motoristas e entregadores:</span>
            {platforms.map((platform) => (
              <Badge key={platform.name} className={`${platform.color} text-sm px-3 py-1`}>
                {platform.name}
              </Badge>
            ))}
            <Badge variant="outline" className="text-sm px-3 py-1">
              e outros
            </Badge>
          </div>
        </div>

        {/* Benefits Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={benefit.title}
                className="p-4 bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Junte-se a centenas de profissionais que já protegem seus direitos
          </p>
        </div>
      </div>
    </div>
  );
}
