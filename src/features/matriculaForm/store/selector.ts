import type { RootState } from '@/app/store';

export const selectFlagEnabled = (s: RootState) => s.matriculaForm.flag.enabled;
export const selectAnio = (s: RootState) => s.matriculaForm.flag.anio;
export const selectStep = (s: RootState) => s.matriculaForm.step;
export const selectForm = (s: RootState) => s.matriculaForm.form;
export const selectDuplicate = (s: RootState) => s.matriculaForm.duplicate;
export const selectSubmissionResult = (s: RootState) => s.matriculaForm.submittedDocId;
export const selectStatus = (s: RootState) => s.matriculaForm.status;
export const selectError = (s: RootState) => s.matriculaForm.error;
