import { Link, useNavigate } from '@tanstack/react-router';
import { Menu, Home, FileText, Calculator, MessageSquare, BarChart3, CreditCard, User, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import LoginButton from './LoginButton';
import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin } from '../hooks/useIsAdmin';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { isAdmin } = useIsAdmin();

  const navItems = [
    { to: '/', label: 'Início', icon: Home },
    { to: '/evidencias', label: 'Evidências', icon: FileText },
    { to: '/calculadora', label: 'Calculadora', icon: Calculator },
    { to: '/recursos', label: 'Recursos', icon: MessageSquare },
    { to: '/dados-coletivos', label: 'Dados Coletivos', icon: BarChart3 },
  ];

  const quickAccessItems = [
    { to: '/pagamentos', label: 'Pagamentos', icon: CreditCard },
    { to: '/perfil', label: 'Perfil', icon: User },
    { to: '/consulta-rapida', label: 'Consulta Rápida', icon: Search },
  ];

  const handleNavClick = (to: string) => {
    setOpen(false);
    navigate({ to });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <nav className="flex flex-col gap-2 mt-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.to}
                        variant="ghost"
                        className="justify-start text-lg h-14"
                        onClick={() => handleNavClick(item.to)}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {item.label}
                      </Button>
                    );
                  })}
                  {isAuthenticated && (
                    <>
                      <Separator className="my-2" />
                      <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">
                        Acesso Rápido
                      </div>
                      {quickAccessItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Button
                            key={item.to}
                            variant="ghost"
                            className="justify-start text-base h-12"
                            onClick={() => handleNavClick(item.to)}
                          >
                            <Icon className="mr-3 h-4 w-4" />
                            {item.label}
                          </Button>
                        );
                      })}
                      {isAdmin && (
                        <>
                          <Separator className="my-2" />
                          <Button
                            variant="ghost"
                            className="justify-start text-base h-12 text-primary"
                            onClick={() => handleNavClick('/admin')}
                          >
                            <ShieldCheck className="mr-3 h-4 w-4" />
                            Admin
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-3">
              <img
                src="/assets/generated/logo-rotas-e-direitos.dim_512x512.png"
                alt="ROTAS E DIREITOS"
                className="h-10 w-10"
              />
              <span className="font-bold text-xl hidden sm:inline-block">ROTAS E DIREITOS</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button key={item.to} variant="ghost" asChild className="text-base">
                  <Link to={item.to}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
            {isAdmin && (
              <Button variant="ghost" asChild className="text-base text-primary">
                <Link to="/admin">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </Button>
            )}
          </nav>

          <LoginButton />
        </div>
      </header>

      <main className="flex-1 container px-4 py-8">{children}</main>

      <footer className="border-t border-border/40 bg-card/50 mt-auto">
        <div className="container px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <Link to="/privacidade" className="hover:text-foreground underline">
                Política de Privacidade
              </Link>
              <Link to="/politica-dados" className="hover:text-foreground underline">
                Política de Dados
              </Link>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} • Construído com ❤️ usando{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'rotas-e-direitos'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
