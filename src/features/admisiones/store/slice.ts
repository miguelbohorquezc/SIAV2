import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Applicant } from '../types';
import { PAGE_SIZE_DEFAULT, ORDEN, type Orden } from '../constants';
import {
  fetchApplicantsPage,
  syncRecent,
  updateEstado,
  authorizeMatricula,
  revokeMatricula,
  updateFuente,
  updateTags,
} from './thunks';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

export type Filters = {
  q: string;
  estado: string | null;
  tag: string | null;
  autorizado: boolean | null;
  dateFrom: number | null;
  dateTo: number | null;
  orden: Orden;
  year: number | null;
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
    year: null,
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

    // ---- NUEVO: upsertOne para reflejar cambios en vivo (onSnapshot) ----
    upsertOne: (s, a: PayloadAction<Applicant>) => {
      const doc = a.payload;
      s.entities[doc.id] = doc;
      if (!s.ids.includes(doc.id)) s.ids.push(doc.id);
    },

    // Filtro por año
    setFilterYear: (s, a: PayloadAction<number | null>) => {
      s.filters.year = a.payload;
    },
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
          s.ids.sort((A, B) =>
            s.filters.orden === 'createdAt_desc'
              ? s.entities[B].createdAt - s.entities[A].createdAt
              : s.entities[A].createdAt - s.entities[B].createdAt,
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
        const e = s.entities[id];
        if (e) {
          e.estado = estado;
          e.motivoNoAdmision = estado === 'no_admitido' ? (motivo ?? '') : null;
          e.updatedAt = Date.now();
        }
      })
      .addCase(authorizeMatricula.fulfilled, (s, a) => {
        const { id, actorEmail } = a.payload as { id: string; actorEmail?: string | null };
        const e = s.entities[id];
        if (e) {
          e.autorizadoMatricula = true;
          e.autorizadoBy = actorEmail ?? e.autorizadoBy ?? 'system';
          e.autorizadoAt = Date.now();
          e.updatedAt = Date.now();
        }
      })
      .addCase(revokeMatricula.fulfilled, (s, a) => {
        const { id } = a.payload as { id: string };
        const e = s.entities[id];
        if (e) {
          e.autorizadoMatricula = false;
          e.autorizadoBy = null;
          e.autorizadoAt = null;
          e.updatedAt = Date.now();
        }
      })
      .addCase(updateFuente.fulfilled, (s, a) => {
        const { id, fuente } = a.payload as { id: string; fuente: string };
        const e = s.entities[id];
        if (e) {
          e.fuente = fuente;
          e.updatedAt = Date.now();
        }
      })
      .addCase(updateTags.fulfilled, (s, a) => {
        const { id, tags } = a.payload as { id: string; tags: string[] };
        const e = s.entities[id];
        if (e) {
          e.tags = tags;
          e.updatedAt = Date.now();
        }
      });
  },
});

export const {
  setFilter,
  clearFilters,
  toggleSelect,
  clearSelection,
  upsertOne,
  setFilterYear,
  setFilterYearExclusive,
} = slice.actions;

export const reducerKey = 'admisiones';
export const reducer = slice.reducer;
export default slice;
