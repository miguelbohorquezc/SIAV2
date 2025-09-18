/* ============================================
 * aspirantesAdmin.service.ts
 * Servicio (DI con fallback) para Aspirantes Admin
 * - list(): lectura real desde Firestore (v9 modular)
 * - Filtros: documento exacto (numérico) en servidor; texto en cliente (temporal)
 * - Orden: createdAt desc (tu colección lo tiene)
 * ============================================
 */
import type { Firestore } from 'firebase/firestore';
import {
  collection,
  getDocs,
  orderBy,
  limit,
  query,
  where,
} from 'firebase/firestore';
import type { QueryConstraint } from 'firebase/firestore';
import { db as defaultDb } from '@/infrastructure/firebase/firebase';
import type { AspiranteDTO } from '../types/aspirantes-admin.types';

// [ASPADM:SERVICE:PAGINATION_CURSOR]
// Placeholder de cursores: se implementará en Sub-tarea 6 (startAfter).

export type ListParams = {
  page: number;
  pageSize: number;
  search?: string;
  collectionPath?: string; // permite apuntar a 'applicants'
};

export type ListResult = {
  items: AspiranteDTO[];
  total: number; // estimado; real con cursores en Sub-tarea 6
};

export interface IAspirantesAdminService {
  list(params: ListParams): Promise<ListResult>;
  // TODO: create, update, toggleFlag, exportCSV
}

const DEFAULT_COLLECTION = 'aspirantes'; // se puede sobreescribir vía DI

// [ASPADM:SERVICE:LIST]
// Lectura real desde Firestore (orden createdAt desc) + filtros
export function createAspirantesAdminService(
  { db = defaultDb, collectionPath = DEFAULT_COLLECTION }: { db?: Firestore; collectionPath?: string } = {}
): IAspirantesAdminService {
  return {
    async list({ page, pageSize, search, collectionPath: cp }: ListParams): Promise<ListResult> {
      const path = cp ?? collectionPath;
      const effectivePage = Math.max(1, page || 1);
      const effectivePageSize = Math.max(1, pageSize || 10);

      // 👉 Tu colección muestra createdAt. Usamos ese campo para ordenar.
      const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(effectivePageSize)];

      // Filtro exacto por documento si search es numérico (si el campo existe en tus docs)
      const raw = (search ?? '').trim();
      if (raw && /^\d+$/.test(raw)) {
        constraints.unshift(where('documento', '==', raw));
      }

      let items: AspiranteDTO[] = [];
      try {
        const snap = await getDocs(query(collection(db, path), ...constraints));
        items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as object) })) as AspiranteDTO[];
      } catch (err) {
        // Re-lanzamos; el hook mapea a ERROR_KEYS.ASPIRANTES_LIST_FAILED
        throw err;
      }

      // Filtro en cliente por nombre/apellidos/documento si search es texto (temporal)
      if (raw && !/^\d+$/.test(raw)) {
        const normalize = (s: string) =>
          s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
        const q = normalize(raw);
        items = items.filter((it) => {
          const nombres = normalize(`${it.nombres ?? ''} ${it.apellidos ?? ''}`);
          const documento = normalize(`${it.documento ?? ''}`);
          return nombres.includes(q) || documento.includes(q);
        });
      }

      // Total estimado: si la página está llena, asumimos que podría existir otra página (+1).
      const totalEstimado =
        items.length < effectivePageSize
          ? (effectivePage - 1) * effectivePageSize + items.length
          : effectivePage * effectivePageSize + 1;

      return { items, total: totalEstimado };
    },
  };
}
