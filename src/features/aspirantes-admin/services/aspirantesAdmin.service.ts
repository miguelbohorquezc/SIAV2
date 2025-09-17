/* ============================================
 * aspirantesAdmin.service.ts (SKELETON)
 * - Sin lógica, sin IO. Solo contratos y DI listos.
 * - Ramas: cubbico@firebaseConfig → SIAV2@feat/aspirantes-migration
 * ============================================
 */
import type {
  AspiranteDTO,
  AspiranteId,
  AspirantesListQuery,
  Paginated,
} from '../types/aspirantes-admin.types';
import { ERROR_KEYS } from '../constants/aspirantes-admin.constants';

/* [ASPADM:SERVICE:CONTRACT] */
export interface IAspirantesAdminService {
  create(dto: Omit<AspiranteDTO, 'id' | 'createdAt' | 'updatedAt'>): Promise<AspiranteDTO>;
  update(id: AspiranteId, patch: Partial<AspiranteDTO>): Promise<AspiranteDTO>;
  getById(id: AspiranteId): Promise<AspiranteDTO | null>;
  list(query: AspirantesListQuery): Promise<Paginated<AspiranteDTO>>;
  toggleFlag(id: AspiranteId, flagKey: keyof NonNullable<AspiranteDTO['flags']>, value: boolean): Promise<void>;
  exportCSV?(query: AspirantesListQuery): Promise<Blob | string>;
}

/* [ASPADM:SERVICE:DI_TOKEN]
 * Token de DI: permite testear/inyectar implementaciones (Firestore, mocks)
 */
export type FirestoreLike = unknown; // TODO(turno posterior): sustituir por tipo real si existe en shared/types

/* [ASPADM:SERVICE:FACTORY]
 * Fábrica: recibe dependencias (p.ej. firestore) y retorna la implementación.
 */
export function createAspirantesAdminService(_deps: { firestore?: FirestoreLike }): IAspirantesAdminService {
  /* [ASPADM:SERVICE:STUBS]
   * Stubs sin lógica. Lanza errores tipados para no ocultar usos accidentales.
   */
  return {
    async create(_dto) {
      // TODO: implementar con Firestore en turno posterior
      throw new Error(ERROR_KEYS.ASPIRANTES_CREATE_FAILED);
    },
    async update(_id, _patch) {
      // TODO
      throw new Error(ERROR_KEYS.ASPIRANTES_UPDATE_FAILED);
    },
    async getById(_id) {
      // TODO
      throw new Error(ERROR_KEYS.ASPIRANTES_GET_FAILED);
    },
    async list(_query) {
      // TODO
      throw new Error(ERROR_KEYS.ASPIRANTES_LIST_FAILED);
    },
    async toggleFlag(_id, _flagKey, _value) {
      // TODO
      throw new Error(ERROR_KEYS.ASPIRANTES_FLAG_TOGGLE_FAILED);
    },
    async exportCSV(_query) {
      // TODO (definir formato final)
      throw new Error(ERROR_KEYS.ASPIRANTES_EXPORT_FAILED);
    },
  };
}

/* [ASPADM:SERVICE:NEXT]
 * Próximo: implementar list/getById/create usando colecciones existentes en Firestore.
 */
