// [ANCLA:SERVICE_ASPIRANTES_V2]
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/infrastructure/firebase/firebase";
import {
  ASPIRANTES_COLLECTION,
  ASPIRANTE_ESTADOS,
  ASPIRANTE_FLAGS,
  ASPIRANTE_FUENTE,
} from "@/shared/constants/aspirantes";
import type { AspiranteDTO } from "../types/aspirantes";

/** Resultado estándar para operaciones de creación/actualización. */
export type ServiceResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

/** Nombre de la colección centralizada (anti-hardcode). */
const COLLECTION = ASPIRANTES_COLLECTION;

/** Valida precondiciones básicas para evitar fallas silenciosas. */
function assertEnv() {
  if (!db) throw mkErr("firestore-not-initialized", "Firestore DB no está inicializado");
  if (typeof COLLECTION !== "string" || !COLLECTION) {
    throw mkErr("invalid-collection", `Nombre de colección inválido: "${String(COLLECTION)}"`);
  }
}

function mkErr(code: string, message: string, cause?: unknown) {
  const e = new Error(message) as any;
  e.code = code;
  if (cause) e.cause = cause;
  return e;
}

function diag(e: any) {
  const code = e?.code ?? "unknown";
  const msg = e?.message ?? "unknown";
  const stack = e?.stack ? String(e.stack).split("\n")[0] : "";
  return `[${code}] ${msg}${stack ? ` :: ${stack}` : ""}`;
}

/**
 * Crea un Aspirante en Firestore.
 * - Persiste payload 1:1 con el formulario + metacampos (estado, flags, timestamps) y trazas mínimas.
 * - Retorna el id del documento como "folio".
 */
export async function createAspirante(data: AspiranteDTO): Promise<ServiceResult> {
  try {
    assertEnv();

    const payload = {
      ...data,
      aceptaTerminos: !!data.aceptaTerminos,
      estado: ASPIRANTE_ESTADOS.RECIBIDO,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publico: ASPIRANTE_FLAGS.PUBLICO,
      fuente: ASPIRANTE_FUENTE,
      __schemaVersion: 1,
      __source: "web-publico",
    };

    // Opción A: addDoc (auto-id)
    const colRef = collection(db, COLLECTION);
    const docRef = await addDoc(colRef, payload);

    // Verificación simple (opcional pero útil en debug)
    if (!docRef?.id) throw mkErr("no-id-returned", "Firestore no retornó id al crear el documento");

    return { ok: true, id: docRef.id };
  } catch (e: any) {
    console.error("[aspirantes.service] createAspirante error:", e, "\nDIAG:", diag(e));
    // Devuelve el code si existe (permission-denied/unavailable/etc.) o el message
    return { ok: false, error: e?.code ?? e?.message ?? "unknown" };
  }
}

/**
 * Actualiza parcialmente un Aspirante (merge).
 * - Pensado para backoffice o correcciones.
 */
export async function updateAspirante(id: string, partial: Partial<AspiranteDTO>): Promise<ServiceResult> {
  try {
    assertEnv();
    if (!id) throw mkErr("invalid-arg", "id requerido en updateAspirante");
    const ref = doc(collection(db, COLLECTION), id);
    await setDoc(ref, { ...partial, updatedAt: serverTimestamp() }, { merge: true });
    return { ok: true, id };
  } catch (e: any) {
    console.error("[aspirantes.service] updateAspirante error:", e, "\nDIAG:", diag(e));
    return { ok: false, error: e?.code ?? e?.message ?? "unknown" };
  }
}
