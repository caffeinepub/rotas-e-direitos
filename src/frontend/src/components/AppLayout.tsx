import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin } from '../hooks/useIsAdmin';
import LoginButton from './LoginButton';
import { 
  Home, 
  FileText, 
  Camera, 
  Calculator, 
  Users, 
  BookOpen, 
  HelpCircle, 
  Shield,
  CreditCard,
  User,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useState, ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { identity } = useInternetIdentity();
  const { isAdmin } = useIsAdmin();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/evidencias', icon: Camera, label: 'Evidências' },
    { to: '/calculadora', icon: Calculator, label: 'Calculadora' },
    { to: '/recursos', icon: FileText, label: 'Recursos' },
    { to: '/dados-coletivos', icon: Users, label: 'Coletivo' },
  ];

  const accountItems = [
    { to: '/perfil', icon: User, label: 'Perfil' },
    { to: '/planos', icon: CreditCard, label: 'Planos' },
    { to: '/consulta-rapida', icon: Search, label: 'Processos' },
  ];

  const legalItems = [
    { to: '/privacidade', icon: Shield, label: 'Privacidade' },
    { to: '/politica-dados', icon: Shield, label: 'Dados' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-32 md:h-40 lg:h-48 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-accent/20 rounded-md transition-colors text-foreground"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="/assets/generated/logo.dim_400x400.png" 
                alt="Rotas e Direitos Logo" 
                className="h-32 w-auto object-contain md:h-40 lg:h-48"
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <Link
                to="/"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary transition-colors"
              >
                <Home className="h-4 w-4" />
                <span className="font-medium">Dashboard</span>
              </Link>
            )}
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <nav className="fixed left-0 top-32 md:top-40 lg:top-48 bottom-0 w-64 bg-background border-r border-border p-4 overflow-y-auto">
            <div className="space-y-6">
              {isAuthenticated && (
                <>
                  <div>
                    <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                      Navegação
                    </h3>
                    <div className="space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/20 transition-colors text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <item.icon className="h-4 w-4 text-primary" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                      Conta
                    </h3>
                    <div className="space-y-1">
                      {accountItems.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/20 transition-colors text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <item.icon className="h-4 w-4 text-primary" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {isAdmin && (
                    <div>
                      <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                        Admin
                      </h3>
                      <div className="space-y-1">
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/20 transition-colors text-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Shield className="h-4 w-4 text-primary" />
                          <span>Painel Admin</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div>
                <h3 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                  Legal
                </h3>
                <div className="space-y-1">
                  {legalItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/20 transition-colors text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4 text-primary" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3 text-primary">
                Rotas e Direitos
              </h3>
              <p className="text-sm text-muted-foreground">
                Plataforma de apoio para trabalhadores de aplicativos
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-primary">Links Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/privacidade" className="text-muted-foreground hover:text-primary transition-colors">
                    Política de Privacidade
                  </Link>
                </li>
                <li>
                  <Link to="/politica-dados" className="text-muted-foreground hover:text-primary transition-colors">
                    Política de Dados
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-primary">Contato</h4>
              <p className="text-sm text-muted-foreground">
                Para dúvidas e suporte, entre em contato conosco
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Rotas e Direitos. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'rotas-e-direitos'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
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
