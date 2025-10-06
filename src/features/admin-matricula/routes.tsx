import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/app/guard/PrivateRoute';
import RoleRoute from '@/app/guard/RoleRoute';
import { AUTH_ROLES } from '@/shared/constants/auth';
import { PrivateRoutes } from '@/shared/constants/routes';

const MatriculasListPage = lazy(() => import('./pages/MatriculasListPage'));
const MatriculaDetailPage = lazy(() => import('./pages/MatriculaDetailPage'));
const MatriculasExportPage = lazy(() => import('./pages/MatriculasExportPage'));

export const routes: RouteObject[] = [
  {
    path: `/${PrivateRoutes.ADMIN_MATRICULAS}`,
    element: (
      <PrivateRoute>
        <RoleRoute allowed={[AUTH_ROLES.SECRETARIA]}>
          <MatriculasListPage />
        </RoleRoute>
      </PrivateRoute>
    ),
  },
  {
    path: '/admin/matriculas/:id',
    element: (
      <PrivateRoute>
        <RoleRoute allowed={[AUTH_ROLES.SECRETARIA]}>
          <MatriculaDetailPage />
        </RoleRoute>
      </PrivateRoute>
    ),
  },
  {
    path: '/admin/matriculas/export',
    element: (
      <PrivateRoute>
        <RoleRoute allowed={[AUTH_ROLES.SECRETARIA]}>
          <MatriculasExportPage />
        </RoleRoute>
      </PrivateRoute>
    ),
  },
];

export default routes;
