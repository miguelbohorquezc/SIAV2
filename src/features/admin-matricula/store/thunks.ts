import { createAsyncThunk } from '@reduxjs/toolkit';
import * as svc from '../services/matriculas.service';
import type { AdminMatriculaState, Estado, Matricula } from './slice';

type Filters = AdminMatriculaState['filters'];

export const fetchMatriculas = createAsyncThunk(
  'adminMatricula/fetchMatriculas',
  async (filters: Partial<Filters> | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { adminMatricula: AdminMatriculaState };
      const f = { ...state.adminMatricula.filters, ...(filters || {}) };
      const { pageSize, cursorId } = state.adminMatricula.list;
      return await svc.listMatriculas(f, pageSize, cursorId || undefined);
    } catch (e: any) {
      return rejectWithValue(e.message ?? 'Error al cargar matrículas');
    }
  }
);

export const fetchMatriculaById = createAsyncThunk(
  'adminMatricula/fetchMatriculaById',
  async (id: string, { rejectWithValue }) => {
    try { return await svc.getMatriculaById(id); }
    catch (e: any) { return rejectWithValue(e.message ?? 'No se pudo cargar la matrícula'); }
  }
);

export const updateMatriculaFields = createAsyncThunk(
  'adminMatricula/updateMatriculaFields',
  async ({ id, payload }: { id: string; payload: Partial<Matricula> }, { rejectWithValue }) => {
    try { await svc.updateMatriculaFields(id, payload); return { id, payload }; }
    catch (e: any) { return rejectWithValue(e.message ?? 'No se pudo actualizar'); }
  }
);

export const toggleDocumentoCheck = createAsyncThunk(
  'adminMatricula/toggleDocumentoCheck',
  async ({ id, key, value }: { id: string; key: keyof Matricula['documentos']; value: boolean }, { rejectWithValue }) => {
    try { const docs = await svc.toggleDocumentoCheck(id, key as any, value); return { id, documentos: docs }; }
    catch (e: any) { return rejectWithValue(e.message ?? 'No se pudo cambiar el documento'); }
  }
);

export const marcarMatriculado = createAsyncThunk(
  'adminMatricula/marcarMatriculado',
  async (id: string, { rejectWithValue }) => {
    try { const updated = await svc.marcarMatriculado(id); return updated; }
    catch (e: any) { return rejectWithValue(e.message ?? 'No se pudo marcar matriculado'); }
  }
);

export const revocarMatricula = createAsyncThunk(
  'adminMatricula/revocarMatricula',
  async ({ id, reason }: { id: string; reason: string }, { rejectWithValue }) => {
    try { return await svc.revocarMatricula(id, reason); }
    catch (e: any) { return rejectWithValue(e.message ?? 'No se pudo revocar'); }
  }
);

export const retirarMatricula = createAsyncThunk(
  'adminMatricula/retirarMatricula',
  async ({ id, reason }: { id: string; reason: string }, { rejectWithValue }) => {
    try { return await svc.retirarMatricula(id, reason); }
    catch (e: any) { return rejectWithValue(e.message ?? 'No se pudo marcar retirado'); }
  }
);

export const exportMatriculasXls = createAsyncThunk(
  'adminMatricula/exportMatriculasXls',
  async (args: { anio: number; grado?: string | null; estado?: Estado | null }, { rejectWithValue }) => {
    try { return await svc.exportMatriculasXls(args); }
    catch (e: any) { return rejectWithValue(e.message ?? 'No se pudo exportar'); }
  }
);

export const prepararCiclo = createAsyncThunk(
  'adminMatricula/prepararCiclo',
  async (anioNuevo: number, { rejectWithValue }) => {
    try { return await svc.prepararCiclo(anioNuevo); }
    catch (e: any) { return rejectWithValue(e.message ?? 'No se pudo preparar el ciclo'); }
  }
);

export const mergeFormularioPadre = createAsyncThunk(
  'adminMatricula/mergeFormularioPadre',
  async (args: { anio: number; tipoId: string; numeroId: string; payload: Partial<Matricula> }, { rejectWithValue }) => {
    try { return await svc.mergeFormularioPadre(args); }
    catch (e: any) { return rejectWithValue(e.message ?? 'No se pudo fusionar la información'); }
  }
);
