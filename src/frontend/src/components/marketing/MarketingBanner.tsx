import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { useMarketingBannerCarousel } from './useMarketingBannerCarousel';

interface MarketingBannerProps {
  variant?: 'A' | 'B' | 'C';
}

interface BannerSlide {
  headline: string;
  subheadline: string;
  platforms: string[];
}

const slides: BannerSlide[] = [
  {
    headline: 'Rastreamento de Evidências',
    subheadline: 'Capture e organize fotos, áudios e vídeos com timestamps automáticos para provar sua situação',
    platforms: ['iFood', 'Uber', 'Rappi', '99'],
  },
  {
    headline: 'Calculadora de Perdas',
    subheadline: 'Calcule automaticamente seus prejuízos financeiros com base em ganhos diários e tempo de bloqueio',
    platforms: ['iFood', 'Uber', 'Rappi', '99'],
  },
  {
    headline: 'Gerador de Recursos',
    subheadline: 'Crie recursos profissionais personalizados para contestar bloqueios e desativações injustas',
    platforms: ['iFood', 'Uber', 'Rappi', '99'],
  },
  {
    headline: 'Insights Coletivos',
    subheadline: 'Acesse dados agregados da sua região para fortalecer sua defesa com estatísticas reais',
    platforms: ['iFood', 'Uber', 'Rappi', '99'],
  },
  {
    headline: 'Segurança e Privacidade',
    subheadline: 'Seus dados protegidos com tecnologia blockchain e armazenamento descentralizado',
    platforms: ['iFood', 'Uber', 'Rappi', '99'],
  },
];

export default function MarketingBanner({ variant = 'A' }: MarketingBannerProps) {
  const navigate = useNavigate();
  const { currentSlide, goToSlide, nextSlide, prevSlide, pause, resume } = useMarketingBannerCarousel({
    slideCount: slides.length,
  });

  const handleBannerClick = () => {
    navigate({ to: '/planos' });
  };

  const handleNavClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    pause();
    goToSlide(index);
    setTimeout(resume, 3000);
  };

  const handlePrevClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    pause();
    prevSlide();
    setTimeout(resume, 3000);
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    pause();
    nextSlide();
    setTimeout(resume, 3000);
  };

  const slide = slides[currentSlide];

  const getVariantStyles = () => {
    switch (variant) {
      case 'B':
        return 'bg-gradient-to-br from-primary/12 to-accent/12 border-primary/25';
      case 'C':
        return 'bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20';
      default:
        return 'bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20';
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${getVariantStyles()} border shadow-lg cursor-pointer transition-all hover:shadow-xl group`}
      onClick={handleBannerClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleBannerClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Ver planos e recursos"
    >
      <div className="relative px-6 py-12 md:px-12 md:py-16">
        <div className="max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            {slide.headline}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-6">
            {slide.subheadline}
          </p>
          <div className="flex flex-wrap gap-2">
            {slide.platforms.map((platform) => (
              <span
                key={platform}
                className="px-4 py-2 bg-background/60 backdrop-blur-sm rounded-full text-sm font-medium border border-border/50 shadow-sm"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-md"
            onClick={handlePrevClick}
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-md"
            onClick={handleNextClick}
            aria-label="Próximo slide"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-8 bg-primary shadow-sm'
                : 'w-2 bg-muted-foreground/40 hover:bg-muted-foreground/60'
            }`}
            onClick={(e) => handleNavClick(e, index)}
            aria-label={`Ir para slide ${index + 1}`}
            aria-current={index === currentSlide ? 'true' : 'false'}
          />
        ))}
      </div>
    </div>
  );
}
