import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import { loadFeatureFlag, preloadFromApplicants, submitMatricula, verifyIdentification } from '../services';
import type { Verificacion, MatriculaDoc } from '../types';

export const loadFeatureFlagThunk = createAsyncThunk(
  'matriculaForm/loadFlag',
  async () => loadFeatureFlag()
);

export const verifyIdentificationThunk = createAsyncThunk(
  'matriculaForm/verifyId',
  async ({ tipoId, numeroId, anio }: { tipoId: Verificacion['tipoId']; numeroId: string; anio: number }) =>
    verifyIdentification({ tipoId, numeroId }, anio)
);

/** Precarga OBLIGATORIA y verificación de autorización desde /applicants */
export const preloadIfExistsThunk = createAsyncThunk(
  'matriculaForm/preload',
  async ({ numeroId }: { tipoId: Verificacion['tipoId']; numeroId: string }) =>
    preloadFromApplicants(numeroId)
);

export const submitMatriculaThunk = createAsyncThunk(
  'matriculaForm/submit',
  async (_: void, { getState }) => {
    const state = (getState() as RootState).matriculaForm;
    const anio = state.flag.anio!;
    const payload: Omit<MatriculaDoc,'__schemaVersion'|'createdAt'|'updatedAt'|'updatedByRole'|'fuente'> & { recaptchaToken?: string } = {
      anio,
      estado: 'en_revision',
      verificacion: state.form.verificacion as any,
      estudiante: state.form.estudiante as any,
      madre: state.form.madre as any,
      padre: state.form.padre as any,
      responsable: state.form.responsable as any,
      terms: { acepta: state.form.terms.acepta, version: state.flag.termsVersion },
      publico: true,
      //@ts-ignore
      updatedAt: undefined as any, createdAt: undefined as any, updatedByRole: undefined as any, fuente: undefined as any,
    };
    return submitMatricula(payload);
  }
);
