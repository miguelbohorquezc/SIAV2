import {
  collection, doc, getDoc, setDoc, serverTimestamp,
  query, where, limit, getDocs
} from 'firebase/firestore';
import { db } from '@/infrastructure/firebase/firebase';
import type { FeatureFlag, MatriculaDoc, Verificacion } from '../types';
import { SCHEMA_VERSION } from '../constants';

export type MatriculaServiceDeps = { db?: typeof db };
const paths = {
  flagDoc: () => doc((db as any), 'featureFlags', 'matriculaForm'),
  matriculaDocId: (v: Verificacion, anio: number) => `${v.tipoId}-${v.numeroId}-${anio}`,
  matriculasCol: () => collection((db as any), 'matriculas'),
  applicantsCol: () => collection((db as any), 'applicants'),
};

/** --- Feature flag --- */
export async function loadFeatureFlag(_deps?: MatriculaServiceDeps): Promise<FeatureFlag> {
  const snap = await getDoc(paths.flagDoc());
  if (!snap.exists()) throw new Error('Feature flag no configurado');
  return snap.data() as FeatureFlag;
}

/** --- Duplicado por año actual en /matriculas --- */
export async function existsById(docId: string): Promise<boolean> {
  const ref = doc((db as any), 'matriculas', docId);
  const s = await getDoc(ref);
  return s.exists();
}

export async function verifyIdentification(v: Verificacion, anio: number): Promise<{ duplicate: boolean; docId: string }> {
  const docId = paths.matriculaDocId(v, anio);
  const duplicate = await existsById(docId);
  return { duplicate, docId };
}

/** --- Precarga desde /applicants por número de identificación --- */
type RawApplicant = Record<string, any>;

async function findApplicantDocByNumeroId(numeroId: string): Promise<RawApplicant | null> {
  const tryFields = ['nIdentificacion', 'nidentificacion', 'nIdentificación', 'nidentificación'];
  for (const f of tryFields) {
    const q = query(paths.applicantsCol(), where(f as any, '==', numeroId), limit(1));
    const res = await getDocs(q);
    if (!res.empty) return res.docs[0].data() as RawApplicant;
  }
  return null;
}

/** Mapea applicant a campos del wizard (no sensibles). */
function mapApplicantToPartialMatricula(a: RawApplicant): Partial<MatriculaDoc> {
  const estudiante = {
    gradoAspira: a?.gradoAspira ?? a?.grado ?? '',
    nombres: a?.nombres ?? a?.estudiante?.nombres ?? '',
    apellidos: a?.apellidos ?? a?.estudiante?.apellidos ?? '',
    fechaNacimiento: a?.fechaNacimiento ?? a?.estudiante?.fechaNacimiento ?? '',
    direccion: a?.direccionResidencia ?? a?.direccion ?? a?.estudiante?.direccion ?? '',
    barrio: a?.barrioAspirante ?? a?.barrio ?? '',
    ciudad: a?.ciudad ?? '',
    telefono: a?.telefono ?? a?.estudiante?.telefono ?? '',
    colegioAnterior: a?.colegioProcedencia ?? a?.colegioAnterior ?? '',
    lugarNacimiento: a?.lugarNacimiento ?? '',
  };

  const normTutor = (src: any): any => {
    if (!src) return {};
    const na = src.nombresApellidos as string | undefined;
    const nombres = src.nombres ?? (na ? na : '');
    const apellidos = src.apellidos ?? '';
    return {
      nombres,
      apellidos,
      numeroIdentificacion: src.numeroIdentificacion ?? src.nIdentificacion ?? '',
      email: src.email ?? '',
      telefono: src.telefono ?? '',
      empresa: src.empresa ?? '',
      cargo: src.cargo ?? '',
      direccion: src.direccion ?? '',
      ciudad: src.ciudad ?? '',
      fechaNacimiento: src.fechaNacimiento ?? '',
    };
  };

  const madre = normTutor(a.madre ?? a?.acudienteMadre);
  const padre = normTutor(a.padre ?? a?.acudientePadre);

  const responsable = {
    quienAsumeCostos: a?.responsable?.quienAsumeCostos ?? a?.quienAsumeCostos ?? '',
    seComprometePrimeros10Dias: !!(a?.responsable?.seComprometePrimeros10Dias ?? a?.seComprometePrimeros10Dias ?? false),
  };

  return { estudiante, madre, padre, responsable } as Partial<MatriculaDoc>;
}

/** Devuelve datos + flag de autorización obligatoria (autorizadoMatricula == true). */
export async function preloadFromApplicants(numeroId: string): Promise<{ data: Partial<MatriculaDoc>; autorizado: boolean } | null> {
  const app = await findApplicantDocByNumeroId(numeroId);
  if (!app) return null;
  const autorizado = app.autorizadoMatricula === true;
  const data = mapApplicantToPartialMatricula(app);
  return { data, autorizado };
}

/** --- Envío a /matriculas (único por año) --- */
export async function submitMatricula(payload: Omit<MatriculaDoc,'__schemaVersion'|'createdAt'|'updatedAt'|'updatedByRole'|'fuente'> & { recaptchaToken?: string }): Promise<{ docId: string }> {
  const v = payload.verificacion;
  const docId = paths.matriculaDocId(v, payload.anio);
  const ref = doc((db as any), 'matriculas', docId);

  const key = `matricula-rate-${new Date().getHours()}`;
  const used = Number(localStorage.getItem(key) ?? '0');
  if (used >= 3) throw new Error('Demasiados intentos desde este dispositivo. Inténtelo más tarde.');
  localStorage.setItem(key, String(used + 1));

  const already = await getDoc(ref);
  if (already.exists()) throw new Error('Ya existe una matrícula registrada para esta identificación y año.');

  const docBody: MatriculaDoc = {
    ...payload,
    __schemaVersion: SCHEMA_VERSION,
    estado: 'en_revision',
    publico: true,
    updatedByRole: 'PUBLICO',
    fuente: 'web',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    terms: { acepta: payload.terms.acepta, version: (payload.terms as any).version ?? 1 },
  };
  await setDoc(ref, docBody, { merge: false });
  return { docId };
}
