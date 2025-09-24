import { db, auth } from '@/infrastructure/firebase/firebase';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  doc,
  updateDoc,
  getDoc,
  onSnapshot,
  DocumentSnapshot,
} from 'firebase/firestore';
import type { Applicant } from '@/features/admisiones/types';

type FetchPageArgs = {
  pageSize: number;
  cursor: unknown | null;
  dateWindowFrom?: number;
  dateWindowTo?: number;
};
type FetchRecentArgs = { limit: number };

const toBool = (v: unknown): boolean => v === true;

export const mapSnapshotToApplicant = (d: DocumentSnapshot): Applicant | undefined => {
  if (!d.exists()) return undefined;
  const data: any = d.data();
  return {
    id: d.id,
    __schemaVersion: data.__schemaVersion ?? 1,
    __source: data.__source ?? '',
    aceptaTerminos: !!data.aceptaTerminos,
    apellidos: data.apellidos ?? '',
    barrioAspirante: data.barrioAspirante ?? '',
    colegioProcedencia: data.colegioProcedencia ?? '',
    createdAt: typeof data.createdAt?.toMillis === 'function' ? data.createdAt.toMillis() : Date.now(),
    direccionResidencia: data.direccionResidencia ?? '',
    edadAnios: data.edadAnios ?? '',
    edadMeses: data.edadMeses ?? '',
    estado: data.estado ?? 'en_espera',
    familiaresEnColegio: data.familiaresEnColegio ?? '',
    fechaNacimiento: data.fechaNacimiento ?? '',
    fuente: data.fuente ?? '',
    lugarNacimiento: data.lugarNacimiento ?? '',
    madre: data.madre ?? {},
    nombresApellidos: data.nombresApellidos ?? '',
    numeroIdentificacion: data.numeroIdentificacion ?? '',
    nombres: data.nombres ?? '',
    padre: data.padre ?? {},
    publico: !!data.publico,
    recomendador: data.recomendador ?? {},
    religion: data.religion ?? '',
    sexo: data.sexo ?? '',
    telefonoCasa: data.telefonoCasa ?? '',
    telefono: data.telefono ?? '',
    ultimoGrado: data.ultimoGrado ?? '',
    updatedAt: typeof data.updatedAt?.toMillis === 'function' ? data.updatedAt.toMillis() : Date.now(),
    tags: data.tags ?? [],
    motivoNoAdmision: data.motivoNoAdmision ?? null,
    autorizadoMatricula: toBool(data.autorizadoMatricula),
    autorizadoBy: typeof data.autorizadoBy === 'string' ? data.autorizadoBy : null,
    autorizadoAt:
      typeof data.autorizadoAt?.toMillis === 'function'
        ? data.autorizadoAt.toMillis()
        : typeof data.autorizadoAt === 'number'
        ? data.autorizadoAt
        : null,
  };
};

export const applicantsService = {
  async fetchPage({ pageSize, cursor, dateWindowFrom, dateWindowTo }: FetchPageArgs) {
    const col = collection(db, 'applicants');
    const clauses: any[] = [orderBy('createdAt', 'desc')];
    if (dateWindowFrom) clauses.push(where('createdAt', '>=', dateWindowFrom));
    if (dateWindowTo) clauses.push(where('createdAt', '<=', dateWindowTo));
    let q = query(col, ...clauses, limit(pageSize));
    if (cursor) q = query(col, ...clauses, startAfter(cursor), limit(pageSize));
    const snap = await getDocs(q);
    const items = snap.docs.map((d) => mapSnapshotToApplicant(d)!).filter(Boolean);
    const nextCursor = snap.docs.length === pageSize ? snap.docs[snap.docs.length - 1] : undefined;
    return { items, nextCursor };
  },

  async fetchRecent({ limit: lim }: FetchRecentArgs) {
    const col = collection(db, 'applicants');
    const q = query(col, orderBy('updatedAt', 'desc'), limit(lim));
    const snap = await getDocs(q);
    return { items: snap.docs.map((d) => mapSnapshotToApplicant(d)!).filter(Boolean) };
  },

  async update(id: string, patch: Partial<Applicant>) {
    const ref = doc(db, 'applicants', id);
    await updateDoc(ref, patch as any);
  },

  async authorize(id: string) {
    const uid = auth.currentUser?.uid ?? 'system';
    const email = auth.currentUser?.email ?? uid;
    const ref = doc(db, 'applicants', id);
    await updateDoc(ref, {
      autorizadoMatricula: true,
      autorizadoBy: email,
      autorizadoAt: Date.now(),
      updatedAt: Date.now(),
    } as any);
    return { actorUid: uid, actorEmail: email };
  },

  async revokeAuthorize(id: string) {
    const uid = auth.currentUser?.uid ?? 'system';
    const ref = doc(db, 'applicants', id);
    await updateDoc(ref, {
      autorizadoMatricula: false,
      autorizadoBy: null,
      autorizadoAt: null,
      updatedAt: Date.now(),
    } as any);
    return { actorUid: uid };
  },

  async getById(id: string) {
    const ref = doc(db, 'applicants', id);
    const d = await getDoc(ref);
    return mapSnapshotToApplicant(d);
  },

  /**
   * Suscripción en vivo por id. Retorna `unsubscribe()`.
   */
  watchById(id: string, cb: (a: Applicant | undefined) => void) {
    const ref = doc(db, 'applicants', id);
    return onSnapshot(ref, (snap) => {
      cb(mapSnapshotToApplicant(snap));
    });
  },
};
