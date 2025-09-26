import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { PublicRoutes } from '@/shared/constants/routes';

const MatriculaFormPage = lazy(() => import('@/features/matriculaForm/pages/MatriculaFormPage'));

export const routes: RouteObject[] = [
  {
    path: `/${PublicRoutes.MATRICULA ?? 'matricula'}`,
    element: <MatriculaFormPage />,
  },
];

export default routes;
