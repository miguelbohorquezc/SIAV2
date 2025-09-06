import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from '@/app/guard/PrivateRoute';
import { PublicRoutes, PrivateRoutes } from '@/shared/constants/routes';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));

export default function AppRouter() {
  return (
    <Suspense fallback={<div className="section"><progress className="progress is-primary" max={100} /></div>}>
      <Routes>
        {/* Públicas */}
        <Route path={`/${PublicRoutes.LOGIN}`} element={<LoginPage />} />

        {/* Privadas */}
        <Route
          path={`/${PrivateRoutes.DASHBOARD}`}
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={`/${PublicRoutes.LOGIN}`} replace />} />
      </Routes>
    </Suspense>
  );
}
