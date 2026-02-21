import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import EvidenceTrackerPage from './pages/EvidenceTrackerPage';
import LossCalculatorPage from './pages/LossCalculatorPage';
import AppealGeneratorPage from './pages/AppealGeneratorPage';
import CollectiveInsightsPage from './pages/CollectiveInsightsPage';
import EvidenceDetailPage from './pages/EvidenceDetailPage';
import ProfilePage from './pages/ProfilePage';
import PlansBillingPage from './pages/PlansBillingPage';
import PlansDashboardPage from './pages/PlansDashboardPage';
import PaymentsPage from './pages/PaymentsPage';
import CheckoutPage from './pages/CheckoutPage';
import QuickProcessLookupPage from './pages/QuickProcessLookupPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import DataPolicyPage from './pages/DataPolicyPage';
import PublicOverviewPage from './pages/PublicOverviewPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import QuickAccessPage from './pages/QuickAccessPage';
import ProfileSetupModal from './components/ProfileSetupModal';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <ProfileSetupModal />
      <RouterProvider router={router} />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const evidenceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/evidencias',
  component: EvidenceTrackerPage,
});

const evidenceDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/evidencias/$evidenceId',
  component: EvidenceDetailPage,
});

const calculatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calculadora',
  component: LossCalculatorPage,
});

const appealRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/recursos',
  component: AppealGeneratorPage,
});

const collectiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dados-coletivos',
  component: CollectiveInsightsPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/perfil',
  component: ProfilePage,
});

const plansRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/planos',
  component: PlansBillingPage,
});

const plansDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/planos-dashboard',
  component: PlansDashboardPage,
});

const paymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pagamentos',
  component: PaymentsPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const quickProcessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/consulta-rapida',
  component: QuickProcessLookupPage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacidade',
  component: PrivacyPolicyPage,
});

const dataPolicyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/politica-dados',
  component: DataPolicyPage,
});

const publicOverviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/visao-geral',
  component: PublicOverviewPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

const quickAccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/acesso-rapido',
  component: QuickAccessPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  evidenceRoute,
  evidenceDetailRoute,
  calculatorRoute,
  appealRoute,
  collectiveRoute,
  profileRoute,
  plansRoute,
  plansDashboardRoute,
  paymentsRoute,
  checkoutRoute,
  quickProcessRoute,
  privacyRoute,
  dataPolicyRoute,
  publicOverviewRoute,
  adminRoute,
  quickAccessRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
