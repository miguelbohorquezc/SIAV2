/* ===========================
 * aspirantes-admin.types.ts
 * Feature: Aspirantes Admin (contratos)
 * Ramas: cubbico@firebaseConfig → SIAV2@feat/aspirantes-migration
 * ===========================
 */

/* [ASPADM:TYPES:ID] */
export type AspiranteId = string;

/* [ASPADM:TYPES:ESTADO] */
export type AspiranteEstado =
  | 'nuevo'
  | 'en_proceso'
  | 'admitido'
  | 'rechazado'
  | 'matriculado';

/* [ASPADM:TYPES:FLAGS] */
export type AspiranteFlags = {
  publico?: boolean;
  [k: string]: boolean | undefined;
};

/* [ASPADM:TYPES:DTO] */
export interface AspiranteDTO {
  id?: AspiranteId;
  nombres: string;
  apellidos: string;
  tipoDocumento?: 'CC' | 'TI' | 'CE' | 'PAS' | string;
  documento: string;
  telefono?: string;
  correo?: string;
  grado?: string; // anti-hardcode: mapear a constants si aplica
  estado: AspiranteEstado;
  flags?: AspiranteFlags;
  createdAt?: string; // ISO
  updatedAt?: string; // ISO
}

/* [ASPADM:TYPES:LIST_QUERY] */
export interface AspirantesListQuery {
  search?: string;
  estado?: AspiranteEstado;
  page?: number;
  pageSize?: number;
  orderBy?: 'createdAt' | 'updatedAt' | 'apellidos' | 'nombres';
  orderDir?: 'asc' | 'desc';
}

/* [ASPADM:TYPES:PAGINATED] */
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

/* [ASPADM:TYPES:ADMIN_STATE] */
export interface AdminState {
  filtro: string;
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  items: AspiranteDTO[];
  error?: string; // usar ERROR_KEYS.*
}

/* [ASPADM:TYPES:SERVICE_CONTRACT] */
export interface AspirantesAdminService {
  create(dto: Omit<AspiranteDTO, 'id' | 'createdAt' | 'updatedAt'>): Promise<AspiranteDTO>;
  update(id: AspiranteId, patch: Partial<AspiranteDTO>): Promise<AspiranteDTO>;
  getById(id: AspiranteId): Promise<AspiranteDTO | null>;
  list(query: AspirantesListQuery): Promise<Paginated<AspiranteDTO>>;
  toggleFlag(id: AspiranteId, flagKey: keyof AspiranteFlags, value: boolean): Promise<void>;
  exportCSV?(query: AspirantesListQuery): Promise<Blob | string>; // decidir formato en turno posterior
}

/* [ASPADM:TYPES:NEXT]
 * Próximo turno:
 * - Implementar los esqueletos de servicio/hook que consumen estos contratos.
 * - Alinear con types existentes en /features/aspirantes si hay solapamientos.
 */
