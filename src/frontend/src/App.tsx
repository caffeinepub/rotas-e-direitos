import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import PublicOverviewPage from './pages/PublicOverviewPage';
import EvidenceTrackerPage from './pages/EvidenceTrackerPage';
import EvidenceDetailPage from './pages/EvidenceDetailPage';
import WorkSessionDetailPage from './pages/WorkSessionDetailPage';
import LossCalculatorPage from './pages/LossCalculatorPage';
import AppealGeneratorPage from './pages/AppealGeneratorPage';
import CollectiveInsightsPage from './pages/CollectiveInsightsPage';
import PlansBillingPage from './pages/PlansBillingPage';
import PlansDashboardPage from './pages/PlansDashboardPage';
import PaymentsPage from './pages/PaymentsPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import QuickProcessLookupPage from './pages/QuickProcessLookupPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import DataPolicyPage from './pages/DataPolicyPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProfileSetupModal from './components/ProfileSetupModal';

function RootComponent() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <>
      <AppLayout>
        <Outlet />
      </AppLayout>
      {isAuthenticated && <ProfileSetupModal />}
    </>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
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

const sessionDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sessoes/$sessionId',
  component: WorkSessionDetailPage,
});

const lossCalculatorRoute = createRoute({
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

const plansBillingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/planos',
  component: PlansBillingPage,
});

const plansDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard-planos',
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

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/perfil',
  component: ProfilePage,
});

const quickLookupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/consulta-rapida',
  component: QuickProcessLookupPage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacidade',
  component: PrivacyPolicyPage,
});

const dataRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/politica-dados',
  component: DataPolicyPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  evidenceRoute,
  evidenceDetailRoute,
  sessionDetailRoute,
  lossCalculatorRoute,
  appealRoute,
  collectiveRoute,
  plansBillingRoute,
  plansDashboardRoute,
  paymentsRoute,
  checkoutRoute,
  profileRoute,
  quickLookupRoute,
  privacyRoute,
  dataRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
