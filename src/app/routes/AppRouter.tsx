// src/app/routes/AppRouter.tsx
// -------------------------------------------------------------
// Router principal de la app.
// - Rutas públicas/privadas con Suspense/lazy loading.
// - Guards de autenticación (PrivateRoute) y roles (RoleRoute).
// - Integra las rutas de la feature "Admisiones - Aspirantes" (admin).
//
// Nota sobre guards en la feature Admisiones:
// La feature ya aplica <PrivateRoute> y <RoleRoute> en sus propios elementos.
// Aquí renderizamos esas rutas dentro del layout privado (<App />) para
// mantener el Navbar/estructura. Esto implica “doble guard”, pero es seguro.
// Si prefieres evitar el doble guard, puedes quitar los guards de la feature
// y aplicarlos aquí en el router padre.
// -------------------------------------------------------------

import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import PrivateRoute from '@/app/guard/PrivateRoute';
import RoleRoute from '@/app/guard/RoleRoute';

import { PublicRoutes, PrivateRoutes } from '@/shared/constants/routes';
import { AUTH_ROLES } from '@/shared/constants/auth';
import App from '@/App';

// (Pública) Login
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));

// (Privadas) Dashboard y Users Admin
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const UsersAdminPage = lazy(() => import('@/features/users/pages/UsersAdminPage'));

// (Feature) Admisiones - Aspirantes
// Las rutas exportadas ya incluyen guards; se inyectan dentro del layout privado.
import { routes as admisionesRoutes } from '@/features/admisiones/routes';

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
        {/* ===== RUTAS PÚBLICAS ===== */}
        <Route path={`/${PublicRoutes.LOGIN}`} element={<LoginPage />} />

        {/* ===== RUTAS PRIVADAS (con layout App que incluye Navbar, etc.) ===== */}
        <Route
          element={
            <PrivateRoute>
              <App />
            </PrivateRoute>
          }
        >
          {/* Dashboard */}
          <Route path={PrivateRoutes.DASHBOARD} element={<DashboardPage />} />

          {/* Administración de usuarios (protegida por rol) */}
          <Route
            path={PrivateRoutes.ADMIN_USERS}
            element={
              <RoleRoute allowed={[AUTH_ROLES.COORDINADOR, AUTH_ROLES.SECRETARIA]}>
                <UsersAdminPage />
              </RoleRoute>
            }
          />

          {/* ===== FEATURE: ADMISIONES (Aspirantes) =====
              Importante:
              - Antes había una ruta legacy a "aspirantes-admin". Elimínala para evitar solaparse.
              - Estas rutas vienen con guards aplicados dentro de la feature. */}
          {admisionesRoutes.map((r, i) => (
            <Route key={`admisiones-${i}`} path={r.path!} element={r.element!} />
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

/* -----------------------------------------------------------------------
   GUÍA RÁPIDA DE INTEGRACIÓN DE LA FEATURE (referencia):
   1) Store: registra el reducer de la feature:
      import { reducer as admisionesReducer, reducerKey as admisionesReducerKey } from '@/features/admisiones/store/slice';
      // ...
      [admisionesReducerKey]: admisionesReducer,

   2) Router: importa e inserta las rutas exportadas por la feature:
      import { routes as admisionesRoutes } from '@/features/admisiones/routes';
      {admisionesRoutes.map((r, i) => <Route key={i} path={r.path!} element={r.element!} />)}

   3) Elimina rutas legacy que apunten a /admin/aspirantes con otros componentes
      (p. ej., "aspirantes-admin") para evitar conflictos.

   4) (Opcional) Si prefieres que los guards vivan solo aquí:
      - Quita <PrivateRoute>/<RoleRoute> dentro de la feature y aplícalos
        en este AppRouter alrededor de las páginas de aspirantes.
----------------------------------------------------------------------- */
