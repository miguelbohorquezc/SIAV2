import type { Matricula } from '../store/slice';

/**
 * Lista única de campos REQUERIDOS para poder matricular.
 * Ajusta aquí si cambia la política (evita hardcodear en varios sitios).
 */
export const REQUIRED_DOC_KEYS: (keyof Matricula['documentos'])[] = [
  
  'certMedico',
  'certEstudios',
  'carnetVacunas',
  'fotos3',
  'certEPS',
  'certLaboral',
  'retiroSimat',           // <- NO requerido por defecto (solo aplica a traslados)
  'fotoFamiliarPre',       // <- opcional
  'contratosPagare',
  'pagoMatriculaYCupo',
];

/** Retorna true cuando TODOS los documentos requeridos están en true. */
export function isChecklistCompleto(m: Pick<Matricula, 'documentos'>): boolean {
  const docs = m.documentos || ({} as Matricula['documentos']);
  return REQUIRED_DOC_KEYS.every(k => !!docs[k]);
}

/** Criterio final para habilitar “Matricular”. */
export function canMatricular(m: Matricula | null): boolean {
  if (!m) return false;
  if (m.estado === 'matriculado') return false;
  return isChecklistCompleto(m);
}
