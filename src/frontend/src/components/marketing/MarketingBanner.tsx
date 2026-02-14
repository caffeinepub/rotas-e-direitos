import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Calculator, FileText, TrendingUp, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { bannerSlides } from './marketingBannerSlides';
import { useMarketingBannerCarousel } from './useMarketingBannerCarousel';

interface MarketingBannerProps {
  variant?: 'A' | 'B';
}

export default function MarketingBanner({ variant = 'A' }: MarketingBannerProps) {
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

  const bannerClasses = variant === 'B'
    ? 'relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/25 via-accent/15 to-card/95 border-4 border-primary/35 cursor-pointer transition-all hover:border-primary/55 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-4'
    : 'relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-background border-2 border-primary/30 cursor-pointer transition-all hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

  const cardClasses = variant === 'B'
    ? 'p-4 bg-card/95 backdrop-blur-md border-2 border-primary/25 hover:border-primary/45 hover:shadow-lg transition-all'
    : 'p-4 bg-card/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-colors';

  return (
    <div
      className={bannerClasses}
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
              opacity: index === currentSlide ? (variant === 'B' ? 0.12 : 0.1) : 0,
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

      <div className={`relative z-10 pb-16 md:pb-20 ${variant === 'B' ? 'p-8 md:p-12 lg:p-16' : 'p-6 md:p-10 lg:p-12'}`}>
        {/* Header Section with Slide Content */}
        <div className={`text-center space-y-4 ${variant === 'B' ? 'mb-10' : 'mb-8'}`}>
          <div className="min-h-[120px] md:min-h-[100px] flex flex-col justify-center">
            <h2 className={`font-bold tracking-tight transition-opacity duration-500 ${variant === 'B' ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-3xl md:text-4xl lg:text-5xl'}`}>
              {currentSlideData.headline}
            </h2>
            <p className={`text-muted-foreground max-w-3xl mx-auto mt-4 transition-opacity duration-500 ${variant === 'B' ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'}`}>
              {currentSlideData.subheadline}
            </p>
          </div>

          {/* Platform Badges */}
          <div className={`flex flex-wrap justify-center gap-2 ${variant === 'B' ? 'pt-4' : 'pt-2'}`}>
            <span className="text-sm text-muted-foreground self-center">Para motoristas e entregadores:</span>
            {platforms.map((platform) => (
              <Badge key={platform.name} className={`${platform.color} text-sm px-3 py-1 ${variant === 'B' ? 'text-base px-4 py-1.5' : ''}`}>
                {platform.name}
              </Badge>
            ))}
            <Badge variant="outline" className={`text-sm px-3 py-1 ${variant === 'B' ? 'text-base px-4 py-1.5 border-2' : ''}`}>
              e outros
            </Badge>
          </div>
        </div>

        {/* Services Grid - Responsive with proper spacing */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-6 ${variant === 'B' ? 'gap-6 md:gap-8' : ''}`}>
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card
                key={service.title}
                className={cardClasses}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-3 rounded-full bg-primary/10 ${variant === 'B' ? 'ring-2 ring-primary/25' : ''}`}>
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
          <p className={`text-muted-foreground ${variant === 'B' ? 'text-base' : 'text-sm'}`}>
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
          className={`rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 ${variant === 'B' ? 'h-10 w-10 border-2' : 'h-8 w-8'}`}
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Slide anterior"
        >
          <ChevronLeft className={variant === 'B' ? 'h-5 w-5' : 'h-4 w-4'} />
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
              className={`rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                variant === 'B'
                  ? index === currentSlide
                    ? 'h-3 w-10 bg-primary'
                    : 'h-3 w-3 bg-primary/30 hover:bg-primary/50'
                  : index === currentSlide
                  ? 'h-2 w-8 bg-primary'
                  : 'h-2 w-2 bg-primary/30 hover:bg-primary/50'
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
          className={`rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 ${variant === 'B' ? 'h-10 w-10 border-2' : 'h-8 w-8'}`}
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Próximo slide"
        >
          <ChevronRight className={variant === 'B' ? 'h-5 w-5' : 'h-4 w-4'} />
        </Button>
      </div>
    </div>
  );
}
