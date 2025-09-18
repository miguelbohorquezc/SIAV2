/* ============================================
 * aspirantesAdmin.service.ts
 * Servicio (DI con fallback) para Aspirantes Admin
 * - list(): lectura real desde Firestore (v9 modular)
 * - Filtros: documento exacto (numérico) en servidor; texto en cliente (temporal)
 * - Orden: createdAt desc
 * - Paginación real: startAfter + hasNext
 * ============================================
 */
import type { Firestore, QueryConstraint, QueryDocumentSnapshot } from 'firebase/firestore';
import {
  collection,
  getDocs,
  orderBy,
  limit,
  query,
  where,
  startAfter,
} from 'firebase/firestore';
import { db as defaultDb } from '@/infrastructure/firebase/firebase';
import type { AspiranteDTO } from '../types/aspirantes-admin.types';

// [ASPADM:SERVICE:PAGINATION_CURSOR]
// Cursor: último documento de la página actual. Para la página N, se usa el cursor de la página (N-1).

export type ListParams = {
  page: number;
  pageSize: number;
  search?: string;
  collectionPath?: string;         // permite apuntar a otra colección, p.ej. 'applicants'
  after?: QueryDocumentSnapshot | null; // cursor de la página previa (N-1)
};

export type ListResult = {
  items: AspiranteDTO[];
  total: number;                        // estimado (preciso en páginas previas; +1 si existe siguiente)
  cursor: QueryDocumentSnapshot | null; // último doc de esta página
  hasNext: boolean;                     // indica si existe otra página
};

export interface IAspirantesAdminService {
  list(params: ListParams): Promise<ListResult>;
  // Futuras: create, update, toggleFlag, exportCSV...
}

const DEFAULT_COLLECTION = 'aspirantes'; // se puede sobreescribir vía DI

// [ASPADM:SERVICE:LIST]
// Lectura desde Firestore (orden createdAt desc) + filtros + cursores
export function createAspirantesAdminService(
  { db = defaultDb, collectionPath = DEFAULT_COLLECTION }: { db?: Firestore; collectionPath?: string } = {}
): IAspirantesAdminService {
  return {
    async list({ page, pageSize, search, collectionPath: cp, after }: ListParams): Promise<ListResult> {
      const path = cp ?? collectionPath;
      const effectivePage = Math.max(1, page || 1);
      const effectivePageSize = Math.max(1, pageSize || 10);

      // Base: order by createdAt desc, pedimos pageSize+1 para detectar si hay siguiente
      const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(effectivePageSize + 1)];

      // Filtro exacto por documento si 'search' es numérica
      const raw = (search ?? '').trim();
      const isExactDocFilter = !!(raw && /^\d+$/.test(raw));
      if (isExactDocFilter) {
        constraints.unshift(where('documento', '==', raw));
      }

      // Cursor sólo aplica cuando NO hay filtro exacto por documento
      if (!isExactDocFilter && effectivePage > 1 && after) {
        constraints.push(startAfter(after));
      }

      let items: AspiranteDTO[] = [];
      let cursor: QueryDocumentSnapshot | null = null;
      let hasNext = false;

      try {
        const snap = await getDocs(query(collection(db, path), ...constraints));
        const docs = snap.docs;
        hasNext = docs.length > effectivePageSize;

        const pageDocs = hasNext ? docs.slice(0, effectivePageSize) : docs;
        items = pageDocs.map((d) => ({ id: d.id, ...(d.data() as object) })) as AspiranteDTO[];
        cursor = pageDocs.length ? pageDocs[pageDocs.length - 1] : null;

        // Filtro en cliente (temporal) si 'search' es texto
        if (raw && !isExactDocFilter) {
          const normalize = (s: string) =>
            s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
          const q = normalize(raw);
          items = items.filter((it) => {
            const nombres = normalize(`${it.nombres ?? ''} ${it.apellidos ?? ''}`);
            const documento = normalize(`${it.documento ?? ''}`);
            return nombres.includes(q) || documento.includes(q);
          });
          // Nota: hasNext/cursor se calculan respecto a la página original (previo al filtro cliente).
        }

        // Total estimado: si hasNext => +1 por posible siguiente página
        const pagesBefore = (effectivePage - 1) * effectivePageSize;
        const totalEstimado = hasNext ? pagesBefore + effectivePageSize + 1 : pagesBefore + items.length;

        return { items, total: totalEstimado, cursor, hasNext };
      } catch (err) {
        // El hook mapeará a ERROR_KEYS.ASPIRANTES_LIST_FAILED
        throw err;
      }
    },
  };
}
