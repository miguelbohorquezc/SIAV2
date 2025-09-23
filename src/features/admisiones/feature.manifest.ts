import type { Reducer } from '@reduxjs/toolkit';
import type { RouteObject } from 'react-router-dom';

export type FeatureManifest = {
  id: string;
  routes: RouteObject[];
  reducers?: Record<string, Reducer>;
  permissions?: string[];
  nav?: Array<{ to: string; label: string; role?: string }>;
  init?: () => void | Promise<void>;
};

export const manifest: FeatureManifest = {
  id: 'admisiones',
  routes: [],
  reducers: {},
  permissions: ['COORDINADOR', 'SECRETARIA'],
  nav: [
    { to: '/admin/aspirantes', label: 'Aspirantes', role: 'SECRETARIA' },
    { to: '/admin/aspirantes', label: 'Aspirantes', role: 'COORDINADOR' },
  ],
};
