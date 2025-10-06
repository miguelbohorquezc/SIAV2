import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import {
  exportMatriculasXls,
  fetchMatriculaById,
  fetchMatriculas,
  marcarMatriculado,
  mergeFormularioPadre,
  prepararCiclo,
  revocarMatricula,
  retirarMatricula,
  toggleDocumentoCheck,
  updateMatriculaFields,
} from './thunks';

/** ====== Tipos ====== */
export type DocumentoKeys =
  | 'copiaReg' | 'certMedico' | 'certEstudios' | 'carnetVacunas' | 'fotos3'
  | 'certEPS' | 'certLaboral' | 'retiroSimat' | 'fotoFamiliarPre'
  | 'contratosPagare' | 'pagoMatriculaYCupo';

export type Estado =
  | 'en_revision' | 'matriculado' | 'rechazado'
  | 'pendiente' | 'retirado' | 'revocado';

export interface Matricula {
  id: string;
  __schemaVersion?: number;
  anio: number;
  estado: Estado;
  matriculado: boolean;
  matriculadoAt?: string | null;
  matriculadoBy?: string | null;
  gradoAnterior?: string | null;
  gradoAspira: string;
  createdAt: string | null;
  updatedAt: string | null;
  updatedBy?: string | null;
  updatedByRole?: string | null;
  prevMatriculaId?: string | null;
  prevAnio?: number | null;
  estudiante: {
    nombres: string; apellidos: string; fechaNacimiento?: string; lugarNacimiento?: string;
    barrio?: string; ciudad?: string; direccion?: string; telefono?: string;
    colegioAnterior?: string; fuente?: string;
  };
  padre?: any; madre?: any; responsable?: any;
  verificacion: { tipoId: string; numeroId: string };
  documentos: Record<DocumentoKeys | 'completo', boolean>;
}

export type Filters = { anio: number; grado: string | null; estado: Estado | null; q: string };
export type ListState = { items: Matricula[]; page: number; pageSize: number; total: number; loading: boolean; error: string | null; cursorId?: string | null; };
export type SelectedState = { id: string | null; data: Matricula | null; loading: boolean; error: string | null; };
export type ExportState = { inProgress: boolean; lastUrl: string | null; error: string | null; };
export type PrepareCycleState = { inProgress: boolean; summary: { created: number; skipped: number } | null; error: string | null; };

export interface AdminMatriculaState {
  filters: Filters;
  list: ListState;
  selected: SelectedState;
  export: ExportState;
  prepareCycle: PrepareCycleState;
}

const currentYear = () => new Date().getFullYear();

const initialState: AdminMatriculaState = {
  filters: { anio: currentYear(), grado: null, estado: null, q: '' },
  list: { items: [], page: 1, pageSize: 20, total: 0, loading: false, error: null, cursorId: null },
  selected: { id: null, data: null, loading: false, error: null },
  export: { inProgress: false, lastUrl: null, error: null },
  prepareCycle: { inProgress: false, summary: null, error: null },
};

const slice = createSlice({
  name: 'adminMatricula',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<Filters>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.list.page = 1;
      state.list.cursorId = null;
    },
    resetSelected(state) {
      state.selected = { id: null, data: null, loading: false, error: null };
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMatriculas.pending, (s) => { s.list.loading = true; s.list.error = null; })
      .addCase(fetchMatriculas.fulfilled, (s, a) => {
        s.list.loading = false;
        const { items, total, cursorId, reset } = a.payload as { items: Matricula[]; total: number; cursorId: string | null; reset?: boolean };
        s.list.total = total;
        s.list.cursorId = cursorId;
        s.list.items = reset ? items : [...s.list.items, ...items];
      })
      .addCase(fetchMatriculas.rejected, (s, a) => { s.list.loading = false; s.list.error = String(a.payload ?? a.error.message); });

    builder
      .addCase(fetchMatriculaById.pending, (s) => { s.selected.loading = true; s.selected.error = null; })
      .addCase(fetchMatriculaById.fulfilled, (s, a) => { s.selected.loading = false; s.selected.data = a.payload as Matricula; })
      .addCase(fetchMatriculaById.rejected, (s, a) => { s.selected.loading = false; s.selected.error = String(a.payload ?? a.error.message); });

    builder
      .addCase(updateMatriculaFields.fulfilled, (s, a) => {
        if (s.selected.data && s.selected.data.id === a.payload.id) {
          s.selected.data = { ...s.selected.data, ...(a.payload.payload as any) };
        }
      });

    builder
      .addCase(toggleDocumentoCheck.fulfilled, (s, a) => {
        if (s.selected.data && s.selected.data.id === a.payload.id) {
          s.selected.data.documentos = a.payload.documentos as any;
        }
      });

    builder
      .addCase(marcarMatriculado.fulfilled, (s, a) => {
        if (s.selected.data && s.selected.data.id === (a.payload as Matricula).id) {
          s.selected.data = a.payload as Matricula;
        }
      });

    builder
      .addCase(revocarMatricula.fulfilled, (s, a) => {
        if (s.selected.data && s.selected.data.id === (a.payload as Matricula).id) {
          s.selected.data = a.payload as Matricula;
        }
      });

    builder
      .addCase(retirarMatricula.fulfilled, (s, a) => {
        if (s.selected.data && s.selected.data.id === (a.payload as Matricula).id) {
          s.selected.data = a.payload as Matricula;
        }
      });

    builder
      .addCase(exportMatriculasXls.pending, (s) => { s.export.inProgress = true; s.export.error = null; })
      .addCase(exportMatriculasXls.fulfilled, (s, a) => { s.export.inProgress = false; s.export.lastUrl = (a.payload as { url: string }).url; })
      .addCase(exportMatriculasXls.rejected, (s, a) => { s.export.inProgress = false; s.export.error = String(a.payload ?? a.error.message); });

    builder
      .addCase(prepararCiclo.pending, (s) => { s.prepareCycle.inProgress = true; s.prepareCycle.error = null; })
      .addCase(prepararCiclo.fulfilled, (s, a) => { s.prepareCycle.inProgress = false; s.prepareCycle.summary = a.payload as any; })
      .addCase(prepararCiclo.rejected, (s, a) => { s.prepareCycle.inProgress = false; s.prepareCycle.error = String(a.payload ?? a.error.message); });

    builder
      .addCase(mergeFormularioPadre.fulfilled, () => {
        // no-op
      });
  },
});

export const { setFilters, resetSelected } = slice.actions;

export const reducerKey = 'adminMatricula';
export const reducer = slice.reducer;
