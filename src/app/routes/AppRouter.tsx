import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import PrivateRoute from '@/app/guard/PrivateRoute';
import RoleRoute from '@/app/guard/RoleRoute';

import { PublicRoutes, PrivateRoutes } from '@/shared/constants/routes';
import { AUTH_ROLES } from '@/shared/constants/auth';
import App from '@/App';
import AspiranteFormularioBulma from '@/features/aspirantes/components/AspiranteFormularioBulma';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const UsersAdminPage = lazy(() => import('@/features/users/pages/UsersAdminPage'));
const AspirantesAdminLazy = lazy(() => import('@/features/aspirantes-admin/pages/AspirantesAdminPage'));

export default function AppRouter() {
  return (
    <Suspense
      fallback={
        <div className="section">
          <progress className="progress is-primary" max={100} />
        </div>
      }>

      <Routes>
        {/* Públicas */}
        <Route path={`/${PublicRoutes.LOGIN}`} element={<LoginPage />} />
        <Route path={`/${PrivateRoutes.ASPIRANTES}`} element={<AspiranteFormularioBulma />} />

        {/* Privadas con layout (Navbar) */}
        <Route
          element={
            <PrivateRoute>
              <App />
            </PrivateRoute>
          }>
          <Route path={PrivateRoutes.DASHBOARD} element={<DashboardPage />} />
          <Route
            path={PrivateRoutes.ADMIN_USERS}
            element={
              <RoleRoute allowed={[AUTH_ROLES.COORDINADOR, AUTH_ROLES.SECRETARIA]}>
                <UsersAdminPage />
              </RoleRoute>
            }
          />
          <Route 
            path={PrivateRoutes.ADMIN_ASPIRANTES}
            element={
              <RoleRoute allowed={[AUTH_ROLES.COORDINADOR, AUTH_ROLES.SECRETARIA]}>
                <AspirantesAdminLazy />
              </RoleRoute>
            }
          />
          
        </Route>

        {/* Redirecciones útiles */}
        <Route path="/" element={<Navigate to={`/${PrivateRoutes.DASHBOARD}`} replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={`/${PublicRoutes.LOGIN}`} replace />} />
      </Routes>
    </Suspense>
  );
}
