import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import type { Applicant } from '../types';

const base = (s: RootState) => (s as any).admisiones as import('./slice').AdmisionesState;

export const selectStatus = (s: RootState) => base(s).status;
export const selectPagination = (s: RootState) => base(s).pagination;
export const selectSelection = (s: RootState) => base(s).selection;
export const selectFilters = (s: RootState) => base(s).filters;

export const selectAllApplicants = createSelector([base], (b) => b.ids.map((id) => b.entities[id]));

const normalize = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const selectFilteredApplicants = createSelector(
  [selectAllApplicants, selectFilters],
  (rows, f) => {
    let out = rows.slice();

    if (f.q) {
      const q = normalize(f.q);
      out = out.filter((r) =>
        [r.nombresApellidos, r.apellidos, r.nombres, r.numeroIdentificacion].some((v) =>
          normalize(String(v ?? '')).includes(q),
        ),
      );
    }
    if (f.estado) out = out.filter((r) => r.estado === f.estado);
    if (f.tag) out = out.filter((r) => r.tags.includes(f.tag!));
    if (f.autorizado !== null) out = out.filter((r) => r.autorizadoMatricula === f.autorizado);
    if (f.dateFrom) out = out.filter((r) => r.createdAt >= f.dateFrom!);
    if (f.dateTo) out = out.filter((r) => r.createdAt <= f.dateTo!);

    out.sort((a, b) => (f.orden === 'createdAt_desc' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt));
    return out;
  },
);

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
