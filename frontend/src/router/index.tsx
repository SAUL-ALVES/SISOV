import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

// Pages - lazy loaded
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const LandingPage = lazy(() => import('../features/landing/pages/LandingPage'));
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const FlockManagementPage = lazy(() => import('../features/animals/pages/FlockManagementPage'));
const AnimalPanelPage = lazy(() => import('../features/animals/pages/AnimalPanelPage'));
const QRCodeGenerationPage = lazy(() => import('../features/qrcode/pages/QRCodeGenerationPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const PublicTraceabilityPage = lazy(() => import('../features/traceability/pages/PublicTraceabilityPage'));

// Layouts
const RootLayout = lazy(() => import('../layouts/RootLayout'));
const AppLayout = lazy(() => import('../layouts/AppLayout'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
  </div>
);

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const routes: RouteObject[] = [
  {
    path: '/',
    element: withSuspense(RootLayout),
    children: [
      { index: true, element: withSuspense(LandingPage) },
      { path: 'login', element: withSuspense(LoginPage) },
      { path: 'cadastro', element: withSuspense(RegisterPage) },
      { path: 'rastreabilidade/:id', element: withSuspense(PublicTraceabilityPage) },
    ],
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        {withSuspense(AppLayout)}
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: withSuspense(DashboardPage) },
      { path: 'rebanho', element: withSuspense(FlockManagementPage) },
      { path: 'rebanho/:animalId', element: withSuspense(AnimalPanelPage) },
      { path: 'qrcode', element: withSuspense(QRCodeGenerationPage) },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];
