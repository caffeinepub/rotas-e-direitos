export interface BannerSlide {
  id: string;
  headline: string;
  subheadline: string;
  desktopImage: string;
  mobileImage: string;
}

export const bannerSlides: BannerSlide[] = [
  {
    id: 'slide-1',
    headline: 'Rastreamento de Evidências',
    subheadline: 'Capture e organize fotos, áudios e vídeos com timestamps automáticos para provar sua situação',
    desktopImage: '/assets/generated/banner-hero.dim_1600x600.png',
    mobileImage: '/assets/generated/banner-hero-mobile.dim_900x900.png',
  },
  {
    id: 'slide-2',
    headline: 'Calculadora de Perdas',
    subheadline: 'Calcule automaticamente seus prejuízos financeiros com base em ganhos diários e tempo de bloqueio',
    desktopImage: '/assets/generated/banner-hero.dim_1600x600.png',
    mobileImage: '/assets/generated/banner-hero-mobile.dim_900x900.png',
  },
  {
    id: 'slide-3',
    headline: 'Gerador de Recursos',
    subheadline: 'Crie recursos profissionais personalizados para contestar bloqueios e desativações injustas',
    desktopImage: '/assets/generated/banner-hero.dim_1600x600.png',
    mobileImage: '/assets/generated/banner-hero-mobile.dim_900x900.png',
  },
  {
    id: 'slide-4',
    headline: 'Insights Coletivos',
    subheadline: 'Acesse dados agregados da sua região para fortalecer sua defesa com estatísticas reais',
    desktopImage: '/assets/generated/banner-hero.dim_1600x600.png',
    mobileImage: '/assets/generated/banner-hero-mobile.dim_900x900.png',
  },
  {
    id: 'slide-5',
    headline: 'Segurança e Privacidade',
    subheadline: 'Seus dados protegidos com tecnologia blockchain e armazenamento descentralizado',
    desktopImage: '/assets/generated/banner-hero.dim_1600x600.png',
    mobileImage: '/assets/generated/banner-hero-mobile.dim_900x900.png',
  },
];
