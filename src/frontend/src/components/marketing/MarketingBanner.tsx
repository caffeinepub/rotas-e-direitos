import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Calculator, FileText, TrendingUp, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { bannerSlides } from './marketingBannerSlides';
import { useMarketingBannerCarousel } from './useMarketingBannerCarousel';

export default function MarketingBanner() {
  const navigate = useNavigate();
  const { currentSlide, goToSlide, nextSlide, prevSlide, pause, resume } = useMarketingBannerCarousel({
    slideCount: bannerSlides.length,
    autoAdvanceInterval: 5000,
  });

  const platforms = [
    { name: 'Uber', color: 'bg-foreground/90 text-background' },
    { name: '99', color: 'bg-primary/90 text-primary-foreground' },
    { name: 'iFood', color: 'bg-destructive/90 text-destructive-foreground' },
    { name: 'InDriver', color: 'bg-accent-foreground/90 text-accent' },
  ];

  const services = [
    {
      icon: Camera,
      title: 'Rastreamento de Evidências',
      description: 'Capture fotos, áudios e vídeos com timestamps automáticos',
    },
    {
      icon: Calculator,
      title: 'Calculadora de Perdas',
      description: 'Calcule prejuízos financeiros causados por bloqueios',
    },
    {
      icon: FileText,
      title: 'Gerador de Recursos',
      description: 'Crie recursos profissionais para contestar desativações',
    },
    {
      icon: TrendingUp,
      title: 'Insights Coletivos',
      description: 'Acesse estatísticas da sua região para fortalecer defesas',
    },
    {
      icon: Lock,
      title: 'Segurança e Privacidade',
      description: 'Dados protegidos com tecnologia blockchain',
    },
  ];

  const currentSlideData = bannerSlides[currentSlide];

  const handleBannerClick = () => {
    navigate({ to: '/planos' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBannerClick();
    }
  };

  const handleControlClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleControlKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-background border-2 border-primary/30 cursor-pointer transition-all hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      onClick={handleBannerClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      role="link"
      tabIndex={0}
      aria-label="Ver planos e começar a usar o ROTAS E DIREITOS"
    >
      {/* Background Images - Responsive with Crossfade */}
      <div className="absolute inset-0">
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className="absolute inset-0 opacity-10 transition-opacity duration-700"
            style={{
              opacity: index === currentSlide ? 0.1 : 0,
              pointerEvents: 'none',
            }}
          >
            <picture>
              <source media="(min-width: 768px)" srcSet={slide.desktopImage} />
              <img
                src={slide.mobileImage}
                alt=""
                className="w-full h-full object-cover"
              />
            </picture>
          </div>
        ))}
      </div>

      <div className="relative z-10 p-6 md:p-10 lg:p-12 pb-16 md:pb-20">
        {/* Header Section with Slide Content */}
        <div className="text-center space-y-4 mb-8">
          <div className="min-h-[120px] md:min-h-[100px] flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight transition-opacity duration-500">
              {currentSlideData.headline}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mt-4 transition-opacity duration-500">
              {currentSlideData.subheadline}
            </p>
          </div>

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

        {/* Services Grid - Responsive with proper spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                className="p-4 bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{service.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Junte-se a centenas de profissionais que já protegem seus direitos
          </p>
        </div>
      </div>

      {/* Carousel Controls */}
      <div
        className="absolute bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-4"
        onClick={handleControlClick}
        onKeyDown={handleControlKeyDown}
      >
        {/* Previous Button */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Slide anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Slide Indicators */}
        <div className="flex gap-2">
          {bannerSlides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  goToSlide(index);
                }
              }}
              className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                index === currentSlide
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-primary/30 hover:bg-primary/50'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
              aria-current={index === currentSlide ? 'true' : 'false'}
            />
          ))}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Próximo slide"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
