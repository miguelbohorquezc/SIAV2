/* ============================================
 * useAspirantesAdmin.ts
 * Hook de estado/acciones para Aspirantes Admin
 * - Maneja loading/error, page, pageSize, filtro, items y total (estimado)
 * - Exponen load/reload y helpers de paginación básica
 * ============================================
 */
import { useCallback, useState } from 'react';
import type { AspiranteDTO } from '../types/aspirantes-admin.types';
import type {
  IAspirantesAdminService,
  ListParams,
  ListResult,
} from '../services/aspirantesAdmin.service';
import {
  TABLE_PAGE_SIZE_DEFAULT,
  ERROR_KEYS,
} from '../constants/aspirantes-admin.constants';

// [ASPADM:HOOK:NEXT]
// Placeholder: en Sub-tarea 6 guardaremos cursores por página (Map<number, QueryDocumentSnapshot>)

export type AdminState = {
  filtro: string;
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  items: AspiranteDTO[];
  error?: string;
};

// [ASPADM:HOOK:LOAD]
// Carga real con manejo de loading/error y seteo de total estimado
export function useAspirantesAdmin(service: IAspirantesAdminService) {
  const [state, setState] = useState<AdminState>({
    filtro: '',
    loading: false,
    page: 1,
    pageSize: TABLE_PAGE_SIZE_DEFAULT,
    total: 0,
    items: [],
    error: undefined,
  });

  const load = useCallback(
    async ({
      page,
      pageSize,
      search,
    }: Pick<ListParams, 'page' | 'pageSize' | 'search'>) => {
      setState((s) => ({ ...s, loading: true, error: undefined }));
      try {
        const res: ListResult = await service.list({
          page,
          pageSize,
          search: search ?? state.filtro,
        });

        setState((s) => ({
          ...s,
          loading: false,
          page,
          pageSize,
          total: res.total,
          items: res.items,
          filtro: search ?? s.filtro,
          error: undefined,
        }));
      } catch (e) {
        console.error('[aspirantes-admin] list failed', e);
        setState((s) => ({
          ...s,
          loading: false,
          items: [],
          error: ERROR_KEYS.ASPIRANTES_LIST_FAILED,
        }));
      }
    },
    [service, state.filtro]
  );

  const setPage = useCallback((page: number) => {
    setState((s) => ({ ...s, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setState((s) => ({ ...s, pageSize }));
  }, []);

  const setFilter = useCallback((f: string) => {
    setState((s) => ({ ...s, filtro: f }));
  }, []);

  const reload = useCallback(() => {
    void load({ page: state.page, pageSize: state.pageSize, search: state.filtro });
  }, [load, state.page, state.pageSize, state.filtro]);

  // Atajos de paginación básica (temporal)
  const nextPage = useCallback(() => {
    const p = state.page + 1;
    setPage(p);
    void load({ page: p, pageSize: state.pageSize, search: state.filtro });
  }, [load, setPage, state.page, state.pageSize, state.filtro]);

  const prevPage = useCallback(() => {
    const p = Math.max(1, state.page - 1);
    setPage(p);
    void load({ page: p, pageSize: state.pageSize, search: state.filtro });
  }, [load, setPage, state.page, state.pageSize, state.filtro]);

  return {
    state,
    load,
    reload,
    setPage,
    setPageSize,
    setFilter,
    nextPage,
    prevPage,
  };
}
