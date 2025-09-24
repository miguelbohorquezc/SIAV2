import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { AdmisionesState } from './slice';
import type { Applicant } from '../types';

const base = (s: RootState) => (s as any).admisiones as AdmisionesState;

export const selectStatus = (s: RootState) => base(s).status;
export const selectPagination = (s: RootState) => base(s).pagination;
export const selectSelection = (s: RootState) => base(s).selection;
export const selectFilters = (s: RootState) => base(s).filters;

export const selectAllApplicants = createSelector([base], (b) =>
  b.ids.map((id) => b.entities[id] as Applicant),
);

// Años disponibles según createdAt (para poblar el <select>)
export const selectYearsAvailable = createSelector([selectAllApplicants], (rows) => {
  const years = new Set<number>();
  for (const r of rows) {
    const y = new Date(r.createdAt).getFullYear();
    if (!Number.isNaN(y)) years.add(y);
  }
  return Array.from(years).sort((a, b) => b - a);
});

const normalize = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const selectFilteredApplicants = createSelector([selectAllApplicants, selectFilters], (rows, f) => {
  let out = rows.slice();

  // Año (createdAt)
  if (f.year !== null) {
    out = out.filter((r) => new Date(r.createdAt).getFullYear() === f.year);
  }

  // Rango fechas
  if (f.dateFrom) out = out.filter((r) => r.createdAt >= f.dateFrom!);
  if (f.dateTo) out = out.filter((r) => r.createdAt <= f.dateTo!);

  // Texto
  if (f.q) {
    const q = normalize(f.q);
    out = out.filter((r) =>
      [r.nombresApellidos, r.apellidos, r.nombres, r.numeroIdentificacion].some((v) =>
        normalize(String(v ?? '')).includes(q),
      ),
    );
  }

  // Estado
  if (f.estado) out = out.filter((r) => r.estado === f.estado);

  // Tag
  if (f.tag) out = out.filter((r) => Array.isArray(r.tags) && r.tags.includes(f.tag!));

  // Autorizado
  if (f.autorizado !== null) out = out.filter((r) => r.autorizadoMatricula === f.autorizado);

  // Orden
  out.sort((a, b) => (f.orden === 'createdAt_desc' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt));
  return out;
});

export const selectById =
  (id: string) =>
  (s: RootState): Applicant | undefined => {
    const b = base(s);
    return b.entities[id];
  };

export const selectStats = createSelector([selectAllApplicants], (rows) => {
  const total = rows.length;
  const porEstado = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.estado] = (acc[r.estado] ?? 0) + 1;
    return acc;
  }, {});
  return { total, porEstado };
});
