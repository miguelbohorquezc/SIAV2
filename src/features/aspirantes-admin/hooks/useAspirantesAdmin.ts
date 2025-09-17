/* ============================================
 * useAspirantesAdmin.ts (SKELETON)
 * - Sin IO. Expone estado base + firmas.
 * ============================================
 */
import { useCallback, useMemo, useState } from 'react';
import type {
  AdminState,
  AspiranteDTO,
  AspirantesListQuery,
} from '../types/aspirantes-admin.types';
import { TABLE_PAGE_SIZE_DEFAULT } from '../constants/aspirantes-admin.constants';
import type { IAspirantesAdminService } from '../services/aspirantesAdmin.service';

/* [ASPADM:HOOK:RETORNO] */
export interface UseAspirantesAdminReturn {
  state: AdminState;
  load: (query?: AspirantesListQuery) => Promise<void>;
  create: (dto: Omit<AspiranteDTO, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  update: (id: string, patch: Partial<AspiranteDTO>) => Promise<void>;
  toggleFlag: (id: string, flagKey: keyof NonNullable<AspiranteDTO['flags']>, value: boolean) => Promise<void>;
  exportCSV: (query?: AspirantesListQuery) => Promise<void>;
  setPage: (page: number) => void;
  setFiltro: (f: string) => void;
}

/* [ASPADM:HOOK:FACTORY]
 * Recibe el servicio por DI (facilita pruebas/mocks)
 */
export function useAspirantesAdmin(service: IAspirantesAdminService): UseAspirantesAdminReturn {
  /* [ASPADM:HOOK:STATE] */
  const [state, setState] = useState<AdminState>({
    filtro: '',
    loading: false,
    page: 1,
    pageSize: TABLE_PAGE_SIZE_DEFAULT,
    total: 0,
    items: [],
    error: undefined,
  });

  /* [ASPADM:HOOK:ACTIONS] — Stubs sin IO */
  const setPage = useCallback((page: number) => {
    setState(s => ({ ...s, page }));
  }, []);

  const setFiltro = useCallback((f: string) => {
    setState(s => ({ ...s, filtro: f }));
  }, []);

  const load = useCallback(async (_query?: AspirantesListQuery) => {
    // TODO(turno posterior): invocar service.list y setear estado
    return;
  }, []);

  const create = useCallback(async (_dto: Omit<AspiranteDTO, 'id' | 'createdAt' | 'updatedAt'>) => {
    // TODO: invocar service.create
    return;
  }, []);

  const update = useCallback(async (_id: string, _patch: Partial<AspiranteDTO>) => {
    // TODO: invocar service.update
    return;
  }, []);

  const toggleFlag = useCallback(async (_id: string, _flagKey: keyof NonNullable<AspiranteDTO['flags']>, _value: boolean) => {
    // TODO: invocar service.toggleFlag
    return;
  }, []);

  const exportCSV = useCallback(async (_query?: AspirantesListQuery) => {
    // TODO: invocar service.exportCSV
    return;
  }, []);

  /* [ASPADM:HOOK:RETURN] */
  return useMemo(
    () => ({ state, load, create, update, toggleFlag, exportCSV, setPage, setFiltro }),
    [state, load, create, update, toggleFlag, exportCSV, setPage, setFiltro]
  );
}

/* [ASPADM:HOOK:NEXT]
 * Próximo: conectar con Firestore y manejar estados (loading/error) y paginado.
 */
