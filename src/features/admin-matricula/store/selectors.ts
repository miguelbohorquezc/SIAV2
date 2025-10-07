import type { RootState } from '@/app/store';
import { reducerKey } from './slice';
import type { AdminMatriculaState, Matricula, Estado } from './slice';
import { createSelector } from '@reduxjs/toolkit';
import { canMatricular as canMatricularUtil } from '../utils/checks';

const selectFeature = (s: RootState): AdminMatriculaState | undefined =>
  (s as any)[reducerKey] as AdminMatriculaState | undefined;

const DEFAULT_FILTERS = Object.freeze({
  anio: new Date().getFullYear(),
  grado: null as string | null,
  estado: null as Estado | null,
  q: '' as string,
});

export const selectFilters = (s: RootState) =>
  (selectFeature(s)?.filters ?? DEFAULT_FILTERS);

export const selectMatriculasRaw = (s: RootState): Matricula[] =>
  selectFeature(s)?.list.items ?? [];

export const selectMatriculasLoading = (s: RootState): boolean =>
  !!selectFeature(s)?.list.loading;

export const selectMatriculas = createSelector(
  [selectMatriculasRaw, selectFilters],
  (rows, { grado, estado, q }) => {
    const qNorm = (q ?? '').trim().toLowerCase();
    if (!grado && !estado && !qNorm) return rows;
    return rows.filter((m) => {
      if (grado && String(m.gradoAspira) !== String(grado)) return false;
      if (estado && m.estado !== estado) return false;
      if (qNorm) {
        const hayCoincidencia =
          `${m.estudiante?.nombres ?? ''} ${m.estudiante?.apellidos ?? ''}`.toLowerCase().includes(qNorm) ||
          `${m.verificacion?.tipoId ?? ''}-${m.verificacion?.numeroId ?? ''}`.toLowerCase().includes(qNorm);
        if (!hayCoincidencia) return false;
      }
      return true;
    });
  }
);

export const selectMatriculaById =
  (id: string) =>
  (s: RootState): Matricula | null => {
    const data = selectFeature(s)?.selected.data ?? null;
    return data && data.id === id ? data : null;
  };

export const selectCanMatricular =
  (id: string) =>
  (s: RootState): boolean => {
    const m = selectFeature(s)?.selected.data ?? null;
    if (!m || m.id !== id) return false;
    return canMatricularUtil(m);
  };

export const selectStatsPorGrado =
  ({ anio }: { anio: number }) =>
  (s: RootState) => {
    const list = (selectFeature(s)?.list.items ?? []) as Matricula[];
    return list.filter(m => m.anio === anio).reduce<Record<string, { total:number; matriculados:number }>>((acc, m) => {
      const g = m.gradoAspira;
      acc[g] = acc[g] || { total: 0, matriculados: 0 };
      acc[g].total += 1;
      if (m.estado === 'matriculado') acc[g].matriculados += 1;
      return acc;
    }, {});
  };
