/* ===============================
 * aspirantes-admin.constants.ts
 * Literales centralizados (anti-hardcode)
 * ===============================
 */

/* [ASPADM:CONST:ROUTES] */
export const ASPIRANTES_ADMIN_ROUTE = '/admin/aspirantes'; // mover a shared/constants/routes si existe

/* [ASPADM:CONST:ESTADOS] */
export const ASPIRANTE_ESTADOS = {
  NUEVO: 'nuevo',
  EN_PROCESO: 'en_proceso',
  ADMITIDO: 'admitido',
  RECHAZADO: 'rechazado',
  MATRICULADO: 'matriculado',
} as const;

/* [ASPADM:CONST:PAGINATION] */
export const TABLE_PAGE_SIZE_DEFAULT = 20;
export const TABLE_PAGE_SIZE_OPTIONS = [10, 20, 50];

/* [ASPADM:CONST:ERROR_KEYS] */
export const ERROR_KEYS = {
  ASPIRANTES_CREATE_FAILED: 'ASPIRANTES_CREATE_FAILED',
  ASPIRANTES_UPDATE_FAILED: 'ASPIRANTES_UPDATE_FAILED',
  ASPIRANTES_GET_FAILED: 'ASPIRANTES_GET_FAILED',
  ASPIRANTES_LIST_FAILED: 'ASPIRANTES_LIST_FAILED',
  ASPIRANTES_EXPORT_FAILED: 'ASPIRANTES_EXPORT_FAILED',
  ASPIRANTES_FLAG_TOGGLE_FAILED: 'ASPIRANTES_FLAG_TOGGLE_FAILED',
} as const;

/* [ASPADM:CONST:UI] */
/** Clases oficiales Bulma para tema claro: usar como tokens de UI */
export const BULMA_CLASSES = {
  table: 'table is-fullwidth is-hoverable',
  buttonPrimary: 'button is-primary is-light',
  buttonDanger: 'button is-danger is-light',
  input: 'input',
  field: 'field',
  control: 'control',
  helpError: 'help is-danger',
  tagInfo: 'tag is-info is-light',
} as const;

/* [ASPADM:CONST:NEXT]
 * Próximo turno:
 * - Si existe shared/constants/routes, exportar ASPIRANTES_ADMIN_ROUTE desde allí.
 * - Extraer más tokens Bulma si son recurrentes en la UI.
 */
