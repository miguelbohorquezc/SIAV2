import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import PrivateRoute from '@/app/guard/PrivateRoute';
import RoleRoute from '@/app/guard/RoleRoute';

import { PublicRoutes, PrivateRoutes } from '@/shared/constants/routes';
import { AUTH_ROLES } from '@/shared/constants/auth';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const UsersAdminPage = lazy(() => import('@/features/users/pages/UsersAdminPage'));

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

        {/* Administración de usuarios (solo COORDINADOR / SECRETARIA) */}
        <Route
          path={`/${PrivateRoutes.ADMIN_USERS}`}
          element={
            <RoleRoute allowed={[AUTH_ROLES.COORDINADOR, AUTH_ROLES.SECRETARIA]}>
              <UsersAdminPage />
            </RoleRoute>
          }
        />

        {/* Redirecciones útiles */}
        <Route path="/" element={<Navigate to={`/${PrivateRoutes.DASHBOARD}`} replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={`/${PublicRoutes.LOGIN}`} replace />} />
      </Routes>
    </Suspense>
  );
}
