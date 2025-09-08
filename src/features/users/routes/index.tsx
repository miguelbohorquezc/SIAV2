/**
 * Rutas de Administración de Usuarios, protegidas por rol.
 * Permitidos: COORDINADOR y SECRETARIA.
 */
import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import RoleRoute from '@/app/guard/RoleRoute';
import { ROLES } from '@/shared/constants/roles';

const UsersAdminPage = lazy(() => import('../pages/UsersAdminPage'));

export const usersRoutes: RouteObject[] = [
  {
    path: 'admin/users',
    element: (
      <RoleRoute allowed={[ROLES.COORDINADOR, ROLES.SECRETARIA]}>
        <UsersAdminPage />
      </RoleRoute>
    ),
  },
];
