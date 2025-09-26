import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Verificacion, Estudiante, PersonaBasica, Responsable, Terms } from '../types';
import { loadFeatureFlagThunk, preloadIfExistsThunk, submitMatriculaThunk, verifyIdentificationThunk } from './thunks';

export type Status = 'idle'|'loading'|'success'|'error';
export type MatriculaState = {
  status: Status;
  flag: { enabled: boolean | null; anio: number | null; termsVersion: number; ventana: any | null };
  step: 1|2|3|4|5|6|7;
  form: {
    verificacion: Verificacion;
    estudiante: Partial<Estudiante>;
    madre: Partial<PersonaBasica>;
    padre: Partial<PersonaBasica>;
    responsable: Partial<Responsable>;
    terms: Terms;
  };
  error: string | null;
  duplicate: boolean;
  submittedDocId: string | null;
};

export const reducerKey = 'matriculaForm';

const initialState: MatriculaState = {
  status: 'idle',
  flag: { enabled: null, anio: null, termsVersion: 1, ventana: null },
  step: 1,
  form: {
    verificacion: { tipoId: '' as any, numeroId: '' },
    estudiante: { gradoAspira: '', nombres: '', apellidos: '', fechaNacimiento: '' },
    madre: { nombres: '', apellidos: '', numeroIdentificacion: '', email: '', telefono: '' },
    padre: { nombres: '', apellidos: '', numeroIdentificacion: '', email: '', telefono: '' },
    responsable: { quienAsumeCostos: '', seComprometePrimeros10Dias: false },
    terms: { acepta: false },
  },
  error: null,
  duplicate: false,
  submittedDocId: null,
};

const slice = createSlice({
  name: reducerKey,
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<MatriculaState['step']>) {
      state.step = action.payload;
    },
    updateForm(state, action: PayloadAction<Partial<MatriculaState['form']>>) {
      state.form = { ...state.form, ...action.payload };
    },
    updateVerificacion(state, action: PayloadAction<Partial<Verificacion>>) {
      state.form.verificacion = { ...state.form.verificacion, ...action.payload } as Verificacion;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    reset(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFeatureFlagThunk.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(loadFeatureFlagThunk.fulfilled, (s, a) => {
        s.status = 'idle';
        s.flag.enabled = a.payload.enabled;
        s.flag.anio = a.payload.anio;
        s.flag.termsVersion = a.payload.termsVersion;
        s.flag.ventana = a.payload.ventana ?? null;
      })
      .addCase(loadFeatureFlagThunk.rejected, (s, a) => { s.status = 'error'; s.error = a.error.message ?? 'Error cargando bandera'; })

      .addCase(verifyIdentificationThunk.pending, (s) => { s.status = 'loading'; s.error = null; s.duplicate = false; })
      .addCase(verifyIdentificationThunk.fulfilled, (s, a) => { s.status = 'idle'; s.duplicate = a.payload.duplicate; })
      .addCase(verifyIdentificationThunk.rejected, (s, a) => { s.status = 'error'; s.error = a.error.message ?? 'Error en verificación'; })

      // Precarga: exige existencia en applicants y autorización (autorizadoMatricula == true)
      .addCase(preloadIfExistsThunk.fulfilled, (s, a) => {
        const res = a.payload;
        if (res?.data && res.autorizado) {
          s.error = null;
          s.form = {
            ...s.form,
            estudiante: { ...s.form.estudiante, ...(res.data as any).estudiante },
            madre: { ...s.form.madre, ...(res.data as any).madre },
            padre: { ...s.form.padre, ...(res.data as any).padre },
            responsable: { ...s.form.responsable, ...(res.data as any).responsable },
          };
        } else if (res?.data && !res.autorizado) {
          s.error = 'Esta identificación no está autorizada para matrícula. Contacte a Secretaría.';
        } else {
          s.error = 'No se encontró información relacionada con ese número de identificación.';
        }
      })

      .addCase(submitMatriculaThunk.pending, (s) => { s.status = 'loading'; s.error = null; s.submittedDocId = null; })
      .addCase(submitMatriculaThunk.fulfilled, (s, a) => { s.status = 'success'; s.submittedDocId = a.payload.docId; })
      .addCase(submitMatriculaThunk.rejected, (s, a) => { s.status = 'error'; s.error = a.error.message ?? 'Error al enviar'; });
  },
});

export const { reducer } = slice;
export const { setStep, updateForm, updateVerificacion, setError, reset } = slice.actions;
export default slice;
