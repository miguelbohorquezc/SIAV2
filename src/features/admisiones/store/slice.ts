import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Applicant } from '../types';
import { PAGE_SIZE_DEFAULT, ORDEN, type Orden } from '../constants';
import {
  fetchApplicantsPage,
  syncRecent,
  updateEstado,
  authorizeMatricula,
  updateFuente,
  updateTags,
} from './thunks';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

export type Filters = {
  q: string;
  estado: string | null;
  tag: string | null;
  autorizado: boolean | null;
  dateFrom: number | null;   // timestamp (ms)
  dateTo: number | null;     // timestamp (ms)
  orden: Orden;
  year: number | null;       // <-- NUEVO: filtro por año (createdAt)
};

export type Pagination = {
  pageSize: number;
  cursor: unknown | null;
  hasMore: boolean;
};

export type Selection = { ids: string[] };

export interface AdmisionesState {
  entities: Record<string, Applicant>;
  ids: string[];
  status: Status;
  error: string | null;
  filters: Filters;
  pagination: Pagination;
  selection: Selection;
  lastSync: number | null;
}

const initialState: AdmisionesState = {
  entities: {},
  ids: [],
  status: 'idle',
  error: null,
  filters: {
    q: '',
    estado: null,
    tag: null,
    autorizado: null,
    dateFrom: null,
    dateTo: null,
    orden: ORDEN.CREATED_DESC,
    year: null, // <-- NUEVO
  },
  pagination: {
    pageSize: PAGE_SIZE_DEFAULT,
    cursor: null,
    hasMore: true,
  },
  selection: { ids: [] },
  lastSync: null,
};

const slice = createSlice({
  name: 'admisiones',
  initialState,
  reducers: {
    setFilter: (s, a: PayloadAction<{ key: keyof Filters; value: Filters[keyof Filters] }>) => {
      (s.filters as any)[a.payload.key] = a.payload.value as never;
    },
    clearFilters: (s) => {
      s.filters = initialState.filters;
    },
    toggleSelect: (s, a: PayloadAction<string>) => {
      const id = a.payload;
      s.selection.ids = s.selection.ids.includes(id)
        ? s.selection.ids.filter((x) => x !== id)
        : [...s.selection.ids, id];
    },
    clearSelection: (s) => {
      s.selection.ids = [];
    },
    // --- NUEVO: filtros por año ---
    setFilterYear: (s, a: PayloadAction<number | null>) => {
      s.filters.year = a.payload;
    },
    // Exclusivo: si seteas year, limpia dateFrom/dateTo para evitar combinaciones
    setFilterYearExclusive: (s, a: PayloadAction<number | null>) => {
      s.filters.year = a.payload;
      if (a.payload !== null) {
        s.filters.dateFrom = null;
        s.filters.dateTo = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicantsPage.pending, (s) => {
        s.status = 'loading';
        s.error = null;
      })
      .addCase(fetchApplicantsPage.fulfilled, (s, a) => {
        const { items, nextCursor, append } = a.payload as {
          items: Applicant[];
          nextCursor?: unknown;
          append: boolean;
        };
        items.forEach((doc) => {
          s.entities[doc.id] = doc;
          if (!s.ids.includes(doc.id)) s.ids.push(doc.id);
        });
        s.pagination.cursor = nextCursor ?? null;
        s.pagination.hasMore = Boolean(nextCursor);
        s.status = 'succeeded';
        if (!append) {
          s.ids.sort((a, b) =>
            s.filters.orden === 'createdAt_desc'
              ? s.entities[b].createdAt - s.entities[a].createdAt
              : s.entities[a].createdAt - s.entities[b].createdAt,
          );
        }
      })
      .addCase(fetchApplicantsPage.rejected, (s, a) => {
        s.status = 'failed';
        s.error = a.error.message ?? 'Error al cargar';
      })
      .addCase(syncRecent.fulfilled, (s, a) => {
        a.payload.items.forEach((doc: Applicant) => {
          s.entities[doc.id] = doc;
          if (!s.ids.includes(doc.id)) s.ids.push(doc.id);
        });
        s.lastSync = Date.now();
      })
      .addCase(updateEstado.fulfilled, (s, a) => {
        const { id, estado, motivo } = a.payload as { id: string; estado: Applicant['estado']; motivo?: string };
        const entity = s.entities[id];
        if (entity) {
          entity.estado = estado;
          entity.motivoNoAdmision = estado === 'no_admitido' ? (motivo ?? '') : null;
          entity.updatedAt = Date.now();
        }
      })
      .addCase(authorizeMatricula.fulfilled, (s, a) => {
        const { id, actorUid } = a.payload as { id: string; actorUid: string };
        const e = s.entities[id];
        if (e) {
          e.autorizadoMatricula = true;
          e.autorizadoBy = e.autorizadoBy ?? actorUid; // si el service ya puso email, se respeta
          e.autorizadoAt = Date.now();
          e.updatedAt = Date.now();
        }
      })
      .addCase(updateFuente.fulfilled, (s, a) => {
        const { id, fuente } = a.payload as { id: string; fuente: string };
        if (s.entities[id]) {
          s.entities[id].fuente = fuente;
          s.entities[id].updatedAt = Date.now();
        }
      })
      .addCase(updateTags.fulfilled, (s, a) => {
        const { id, tags } = a.payload as { id: string; tags: string[] };
        if (s.entities[id]) {
          s.entities[id].tags = tags;
          s.entities[id].updatedAt = Date.now();
        }
      });
  },
});

export const {
  setFilter,
  clearFilters,
  toggleSelect,
  clearSelection,
  setFilterYear,
  setFilterYearExclusive,
} = slice.actions;

export const reducerKey = 'admisiones';
export const reducer = slice.reducer;
export default slice;
