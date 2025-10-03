import type { Reducer } from '@reduxjs/toolkit';
import type { RouteObject } from 'react-router-dom';
import { routes } from './routes';
import { reducer, reducerKey } from '@/features/matriculaForm/store/slice';

export type FeatureManifest = {
  id: string;
  routes: RouteObject[];
  reducers?: Record<string, Reducer>;
  permissions?: string[];
  nav?: Array<{ to: string; label: string; role?: string }>;
  init?: () => void | Promise<void>;
};

export const manifest: FeatureManifest = {
  id: 'matriculaForm',
  routes,
  reducers: { [reducerKey]: reducer },
  permissions: ['PUBLICO', 'SECRETARIA'],
  nav: [], // público: sin item en navbar privado
};
