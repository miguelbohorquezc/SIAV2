import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import PrivateRoute from '@/app/guard/PrivateRoute';
import RoleRoute from '@/app/guard/RoleRoute';
import { AUTH_ROLES } from '@/shared/constants/auth';

const AspirantesListPage = lazy(() => import('./pages/AspirantesListPage'));
const AspiranteDetailPage = lazy(() => import('./pages/AspiranteDetailPage'));
const AspirantePrintPage = lazy(() => import('./pages/AspirantePrintPage'));

export const routes: RouteObject[] = [
  {
    path: '/admin/aspirantes',
    element: (
      <PrivateRoute>
        <RoleRoute allowed={[AUTH_ROLES.COORDINADOR, AUTH_ROLES.SECRETARIA]}>
          <AspirantesListPage />
        </RoleRoute>
      </PrivateRoute>
    ),
  },
  {
    path: '/admin/aspirantes/:id',
    element: (
      <PrivateRoute>
        <RoleRoute allowed={[AUTH_ROLES.COORDINADOR, AUTH_ROLES.SECRETARIA]}>
          <AspiranteDetailPage />
        </RoleRoute>
      </PrivateRoute>
    ),
  },
  {
    path: '/admin/aspirantes/:id/ficha',
    element: (
      <PrivateRoute>
        <RoleRoute allowed={[AUTH_ROLES.COORDINADOR, AUTH_ROLES.SECRETARIA]}>
          <AspirantePrintPage />
        </RoleRoute>
      </PrivateRoute>
    ),
  },
];
