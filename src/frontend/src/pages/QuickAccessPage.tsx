import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

interface Platform {
  id: string;
  name: string;
  logo: string;
  deepLink: string;
  webUrl: string;
  description: string;
}

const platforms: Platform[] = [
  {
    id: 'uber',
    name: 'Uber Motorista',
    logo: '/assets/generated/uber-logo.dim_120x120.png',
    deepLink: 'uber://',
    webUrl: 'https://drivers.uber.com/',
    description: 'Acesse o app Uber Motorista',
  },
  {
    id: '99',
    name: '99 Motorista',
    logo: '/assets/generated/99-logo.dim_120x120.png',
    deepLink: '99app://',
    webUrl: 'https://99app.com/motorista/',
    description: 'Acesse o app 99 Motorista',
  },
  {
    id: 'ifood',
    name: 'iFood Entregador',
    logo: '/assets/generated/ifood-logo.dim_120x120.png',
    deepLink: 'ifood://',
    webUrl: 'https://entregador.ifood.com.br/',
    description: 'Acesse o portal iFood Entregador',
  },
];

export default function QuickAccessPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, navigate]);

  const handlePlatformClick = (platform: Platform) => {
    // Try to open the deep link (mobile app)
    const deepLinkAttempt = window.location.href;
    window.location.href = platform.deepLink;

    // Fallback to web URL after a short delay if app doesn't open
    setTimeout(() => {
      // If we're still on the same page, the app didn't open
      if (window.location.href === deepLinkAttempt) {
        window.open(platform.webUrl, '_blank', 'noopener,noreferrer');
      }
    }, 500);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
          Acesso Rápido às Plataformas
        </h1>
        <p className="text-muted-foreground text-lg">
          Acesse rapidamente os aplicativos e portais das principais plataformas de trabalho
        </p>
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => (
          <Card
            key={platform.id}
            className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-primary/50"
            onClick={() => handlePlatformClick(platform)}
          >
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-32 h-32 flex items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors">
                <img
                  src={platform.logo}
                  alt={`${platform.name} logo`}
                  className="w-24 h-24 object-contain"
                />
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {platform.name}
              </CardTitle>
              <CardDescription className="text-base">
                {platform.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <div className="inline-flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                <span>Acessar</span>
                <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <ExternalLink className="h-5 w-5" />
            Como funciona?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <p>
            <strong className="text-foreground">No celular:</strong> Ao clicar em uma plataforma, tentaremos abrir o aplicativo instalado no seu dispositivo.
          </p>
          <p>
            <strong className="text-foreground">No computador:</strong> Você será direcionado para o portal web da plataforma em uma nova aba.
          </p>
          <p className="text-sm">
            💡 <strong className="text-foreground">Dica:</strong> Adicione esta página aos favoritos para acesso ainda mais rápido!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
