import { createSelector } from '@reduxjs/toolkit';
import { usersAdapter } from './slice';
import type { RootState } from '@/app/store';

const base = (s: RootState) => s.usersAdmin;

// Selectores básicos del adapter (all, byId, etc.)
export const usersSelectors = usersAdapter.getSelectors(base);

// UI completo si lo necesitas en componentes
export const selectUI = createSelector(base, (s) => s);

/** Normaliza texto para búsquedas tolerantes a mayúsculas/acentos */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Factory de selector MEMOIZADO que filtra en cliente (Redux),
 * sin tocar Firestore. Úsalo con:
 *   const selectFiltered = useMemo(makeSelectFilteredUsers, []);
 *   const items = useSelector((state) => selectFiltered(state, { q }));
 */
export const makeSelectFilteredUsers = () =>
  createSelector(
    [
      usersSelectors.selectAll,
      (_: RootState, params: { q?: string }) => params.q?.trim() ?? '',
    ],
    (items, q) => {
      if (!q) return items;
      const needle = norm(q);
      return items.filter((u) => {
        const email = norm(u.email ?? '');
        const name = norm(u.displayName ?? '');
        return email.includes(needle) || name.includes(needle);
      });
    }
  );
