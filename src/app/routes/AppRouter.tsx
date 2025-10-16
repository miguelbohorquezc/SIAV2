import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from '@/app/guard/PrivateRoute';
import RoleRoute from '@/app/guard/RoleRoute';

import App from '@/App';
import { AUTH_ROLES } from '@/shared/constants/auth';
import { PublicRoutes, PrivateRoutes } from '@/shared/constants/routes';

import MatriculaFormRoutes from '@/features/matriculaForm/routes';
import admisionesRoutes from '@/features/admisiones/routes';
import adminMatriculaRoutes from '@/features/admin-matricula/routes';
import AspirantesPage from '@/features/aspirantes/pages/AspirantePage';
import MatriculasListPage from '@/features/admin-matricula/pages/MatriculasListPage';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const UsersAdminPage = lazy(() => import('@/features/users/pages/UsersAdminPage'));


export default function AppRouter() {
  return (
    <Suspense
      fallback={
        <div className="section">
          <progress className="progress is-primary" max={100} />
        </div>
      }
    >
      <Routes>
        <Route path={`/${PublicRoutes.LOGIN}`} element={<LoginPage />} />
        <Route path={`/${PublicRoutes.ASPIRANTES}`} element={<AspirantesPage />} />

        {/* Rutas públicas aportadas por la feature de matrícula */}
        {MatriculaFormRoutes.map(r => <Route key={r.path as string} path={r.path as string} element={r.element!} />)}

        {/* ===== RUTAS PRIVADAS (con layout App que incluye Navbar, etc.) ===== */}
          
          <Route
            element={
              <PrivateRoute>
                <App />
              </PrivateRoute>
            }>
          
          <Route 
            path={PrivateRoutes.DASHBOARD} 
            element={
              <DashboardPage />
            }/>

          <Route
            path={PrivateRoutes.ADMIN_USERS}
            element={
              <RoleRoute allowed={[AUTH_ROLES.COORDINADOR, AUTH_ROLES.SECRETARIA]}>
                <UsersAdminPage />
              </RoleRoute>
            }
          />

          <Route
            path={PrivateRoutes.ADMIN_MATRICULAS}
            element={
              <RoleRoute allowed={[AUTH_ROLES.SECRETARIA]}>
                <MatriculasListPage />
              </RoleRoute>
            }/>

          {/* ---Rutas administrativas de la feature admisiones aspirante ------- */}
          {admisionesRoutes.map((r, i) => (
            <Route key={`admisiones-${i}`} 
              path={r.path!} 
              element={r.element!} />
          ))}

          {/* ---Rutas administrativas de la feature admisiones matricula ------- */}
          {adminMatriculaRoutes.map((r, i) => (
            <Route key={`admisiones-${i}`} 
              path={r.path!} 
              element={r.element!} />
          ))}
          </Route>

        {/* ===== REDIRECCIONES ÚTILES ===== */}
        <Route path="/" element={<Navigate to={`/${PrivateRoutes.DASHBOARD}`} replace />} />

        {/* ===== FALLBACK ===== */}
        <Route path="*" element={<Navigate to={`/${PublicRoutes.LOGIN}`} replace />} />
      </Routes>
    </Suspense>
  );
}
