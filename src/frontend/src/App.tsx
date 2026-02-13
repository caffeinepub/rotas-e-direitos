import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import PublicOverviewPage from './pages/PublicOverviewPage';
import EvidenceTrackerPage from './pages/EvidenceTrackerPage';
import EvidenceDetailPage from './pages/EvidenceDetailPage';
import WorkSessionDetailPage from './pages/WorkSessionDetailPage';
import LossCalculatorPage from './pages/LossCalculatorPage';
import AppealGeneratorPage from './pages/AppealGeneratorPage';
import CollectiveInsightsPage from './pages/CollectiveInsightsPage';
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

function IndexComponent() {
  const { identity } = useInternetIdentity();
  return identity ? <Dashboard /> : <PublicOverviewPage />;
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
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

const routeTree = rootRoute.addChildren([
  indexRoute,
  evidenceRoute,
  evidenceDetailRoute,
  sessionDetailRoute,
  lossCalculatorRoute,
  appealRoute,
  collectiveRoute,
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
