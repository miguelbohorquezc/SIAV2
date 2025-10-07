import {
  collection, doc, getDoc, getDocs, query, where, orderBy, limit, startAfter,
  updateDoc, writeBatch, addDoc, serverTimestamp, documentId
} from 'firebase/firestore';
import { db, auth } from '@/infrastructure/firebase/firebase';
import type { Matricula, DocumentoKeys, Estado } from '../store/slice';

type Filters = { anio: number; grado: string | null; estado: Estado | null; q: string };

const COL = 'matriculas';
const SUB_AUDIT = 'audits';

function auditsRef(id: string) {
  return collection(doc(collection(db, COL), id), SUB_AUDIT);
}

async function appendAudit(id: string, action: string, changes?: Partial<Record<string, any>> & { reason?: string }) {
  const user = auth.currentUser;
  await addDoc(auditsRef(id), {
    changedAt: serverTimestamp(),
    changedBy: user?.uid ?? 'unknown',
    role: (await user?.getIdTokenResult())?.claims?.role ?? 'UNKNOWN',
    action,
    ...changes,
  });
}

/** ---------- Helpers de normalización (evita no-serializables en Redux) ---------- */
const toIso = (t: any): string | null => {
  if (!t) return null;
  if (typeof t?.toDate === 'function') return t.toDate().toISOString();
  if (typeof t?.seconds === 'number') return new Date(t.seconds * 1000).toISOString();
  if (typeof t === 'string') return t;
  return null;
};

function fillDocumentos(obj: any): Record<DocumentoKeys | 'completo', boolean> {
  const base = {
    copiaReg:false, certMedico:false, certEstudios:false, carnetVacunas:false, fotos3:false,
    certEPS:false, certLaboral:false, retiroSimat:false, fotoFamiliarPre:false,
    contratosPagare:false, pagoMatriculaYCupo:false, completo:false,
  };
  return { ...base, ...(obj ?? {}) };
}

function normalizeMatricula(id: string, raw: any): Matricula {
  return {
    id,
    __schemaVersion: raw?.__schemaVersion ?? 1,
    anio: Number(raw?.anio ?? new Date().getFullYear()),
    estado: (raw?.estado ?? 'en_revision') as Estado,
    matriculado: Boolean(raw?.matriculado ?? false),
    matriculadoAt: toIso(raw?.matriculadoAt),
    matriculadoBy: raw?.matriculadoBy ?? null,
    gradoAnterior: raw?.gradoAnterior ?? null,
    gradoAspira: raw?.estudiante.gradoAspira ?? null,
    createdAt: toIso(raw?.createdAt),
    updatedAt: toIso(raw?.updatedAt),
    updatedBy: raw?.updatedBy ?? null,
    updatedByRole: raw?.updatedByRole ?? null,
    prevMatriculaId: raw?.prevMatriculaId ?? null,
    prevAnio: raw?.prevAnio ?? null,
    estudiante: raw?.estudiante ?? { nombres:'', apellidos:'' },
    padre: raw?.padre ?? null,
    madre: raw?.madre ?? null,
    responsable: raw?.responsable ?? null,
    verificacion: raw?.verificacion ?? { tipoId:'', numeroId:'' },
    documentos: fillDocumentos(raw?.documentos),
  };
}

/**
 * Lista por AÑO (resto de filtros en cliente). Paginación por **documentId()** para
 * que el cursor sea un **string** serializable (id del último doc).
 */
export async function listMatriculas(
  filters: Filters,
  pageSize: number,
  cursorId?: string | null
) {
  const anioNum = Number(filters.anio);

  let qRef = query(
    collection(db, COL),
    where('anio', '==', anioNum as any),
    orderBy(documentId()),
    limit(pageSize)
  );
  if (cursorId) {
    qRef = query(
      collection(db, COL),
      where('anio', '==', anioNum as any),
      orderBy(documentId()),
      startAfter(cursorId),
      limit(pageSize)
    );
  }

  const snap = await getDocs(qRef);
  const items: Matricula[] = snap.docs.map(d => normalizeMatricula(d.id, d.data()));
  const lastId = snap.docs.length ? snap.docs[snap.docs.length - 1].id : null;

  return { items, total: items.length, cursorId: lastId, reset: !cursorId };
}

export async function getMatriculaById(id: string): Promise<Matricula> {
  const ref = doc(db, COL, id);
  const d = await getDoc(ref);
  if (!d.exists()) throw new Error('No existe la matrícula');
  return normalizeMatricula(d.id, d.data());
}

export async function updateMatriculaFields(id: string, payload: Partial<Matricula>) {
  const ref = doc(db, COL, id);
  await updateDoc(ref, { ...payload, updatedAt: serverTimestamp(), updatedBy: auth.currentUser?.uid ?? null });
  await appendAudit(id, 'update', { fields: Object.keys(payload), newValue: payload });
}

export async function toggleDocumentoCheck(id: string, key: DocumentoKeys, value: boolean) {
  const ref = doc(db, COL, id);
  const path = `documentos.${key}` as any;
  await updateDoc(ref, { [path]: value, updatedAt: serverTimestamp(), updatedBy: auth.currentUser?.uid ?? null });
  await appendAudit(id, 'update', { field: path, newValue: value });
  const updated = await getDoc(ref);
  return fillDocumentos((updated.data() as any)?.documentos);
}

export async function marcarMatriculado(id: string) {
  const ref = doc(db, COL, id);
  await updateDoc(ref, {
    estado: 'matriculado',
    matriculado: true,
    matriculadoAt: serverTimestamp(),
    matriculadoBy: auth.currentUser?.uid ?? null,
    updatedAt: serverTimestamp(),
  });
  await appendAudit(id, 'matricular');
  return await getMatriculaById(id);
}

export async function revocarMatricula(id: string, reason: string) {
  const ref = doc(db, COL, id);
  await updateDoc(ref, { estado: 'revocado', updatedAt: serverTimestamp() });
  await appendAudit(id, 'revocar', { reason });
  return await getMatriculaById(id);
}

export async function retirarMatricula(id: string, reason: string) {
  const ref = doc(db, COL, id);
  await updateDoc(ref, { estado: 'retirado', updatedAt: serverTimestamp() });
  await appendAudit(id, 'retirar', { reason });
  return await getMatriculaById(id);
}

export async function exportMatriculasXls(args: { anio: number; grado?: string | null; estado?: Estado | null }) {
  const list = await listMatriculas({ anio: args.anio, grado: null, estado: null, q: '' }, 1000);
  const rows = [
    ['ID','Año','Estado','Grado','Nombres','Apellidos','Documento'],
    ...list.items.map(m => [m.id, m.anio, m.estado, m.gradoAspira, m.estudiante?.nombres ?? '', m.estudiante?.apellidos ?? '', `${m.verificacion?.tipoId ?? ''}-${m.verificacion?.numeroId ?? ''}`]),
  ];
  const csv = rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  await Promise.all(list.items.map(i => appendAudit(i.id, 'export')));
  return { url, filename: `matriculas_${args.anio}.xls` };
}

export async function prepararCiclo(anioNuevo: number) {
  const anioPrev = anioNuevo - 1;
  const prev = await getDocs(query(collection(db, COL), where('anio','==', anioPrev as any)));
  const batch = writeBatch(db);
  let created = 0; let skipped = 0;
  for (const d of prev.docs) {
    const data = normalizeMatricula(d.id, d.data());
    const idNuevo = `${data.verificacion?.tipoId}-${data.verificacion?.numeroId}-${anioNuevo}`;
    const nuevoRef = doc(collection(db, COL), idNuevo);
    const exists = await getDoc(nuevoRef);
    if (exists.exists()) { skipped++; continue; }
    const base = {
      ...data,
      id: idNuevo,
      anio: anioNuevo,
      prevMatriculaId: d.id,
      prevAnio: anioPrev,
      documentos: fillDocumentos(null),
      estado: 'en_revision',
      matriculado: false,
      matriculadoAt: null,
      matriculadoBy: null,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };
    batch.set(nuevoRef, base);
    created++;
  }
  await batch.commit();
  return { created, skipped };
}

export async function mergeFormularioPadre(args: { anio: number; tipoId: string; numeroId: string; payload: Partial<Matricula> }) {
  const id = `${args.tipoId}-${args.numeroId}-${args.anio}`;
  await updateMatriculaFields(id, args.payload);
  await appendAudit(id, 'update', { fields: Object.keys(args.payload || {}) });
  return { ok: true };
}
