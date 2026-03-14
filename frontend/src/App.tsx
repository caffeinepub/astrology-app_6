import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import PanchangPage from './pages/PanchangPage';
import KundaliPage from './pages/KundaliPage';
import CoinsPage from './pages/CoinsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import AdminPage from './pages/AdminPage';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const panchangRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/panchang',
  component: PanchangPage,
});

const kundaliRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/kundali',
  component: KundaliPage,
});

const coinsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/coins',
  component: CoinsPage,
});

const subscriptionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscription',
  component: SubscriptionPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccess,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailure,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  panchangRoute,
  kundaliRoute,
  coinsRoute,
  subscriptionRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
