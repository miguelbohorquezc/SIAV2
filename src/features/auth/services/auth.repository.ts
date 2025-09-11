// src/features/auth/services/auth.repository.ts

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut as fbSignOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import { auth, db } from '@/infrastructure/firebase/firebase';

export type AuthUser = {
  uid: string;
  email: string | null;
};

export type UnsubscribeFn = () => void;

/** Lee flags de habilitación desde users/{uid}. Si faltan, asume activo. */
async function isUserDisabled(uid: string): Promise<boolean> {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return false; // compat: usuarios legados sin doc no se bloquean

  const data = snap.data() as { active?: boolean; status?: string };
  const active = typeof data.active === 'boolean' ? data.active : true;
  const status = (data.status ?? '').toUpperCase();
  const isInactiveByStatus = status === 'INACTIVE';

  return !active || isInactiveByStatus;
}

/**
 * Configura la persistencia de sesión de Firebase Auth.
 * - 'local'   → persiste entre pestañas/cierres (default).
 * - 'session' → dura solo la sesión de la pestaña.
 * - 'none'    → en memoria.
 */
export async function configureAuthPersistence(
  mode: 'local' | 'session' | 'none' = 'local'
): Promise<void> {
  const map = {
    local: browserLocalPersistence,
    session: browserSessionPersistence,
    none: inMemoryPersistence,
  } as const;

  await setPersistence(auth, map[mode]);
}

/**
 * Inicia sesión con email/password y aplica guard de habilitación.
 * Lanza error con code 'auth/user-disabled' si el usuario está inhabilitado.
 */
export async function signIn(email: string, password: string): Promise<AuthUser> {
  const res = await signInWithEmailAndPassword(auth, email, password);

  // Guard: bloquear si el usuario está inhabilitado en Firestore
  const disabled = await isUserDisabled(res.user.uid);
  if (disabled) {
    await fbSignOut(auth);
    const err: any = new Error('User is disabled');
    err.code = 'auth/user-disabled';
    throw err;
  }

  return { uid: res.user.uid, email: res.user.email };
}

/** Registra un usuario con email/password. */
export async function register(email: string, password: string): Promise<AuthUser> {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  return { uid: res.user.uid, email: res.user.email };
}

/** Envía email para restablecer contraseña. */
export async function requestPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/** Cierra sesión del usuario actual. */
export async function signOut(): Promise<void> {
  await fbSignOut(auth);
}

/**
 * Observa cambios de autenticación y aplica guard de inhabilitación en runtime.
 * Si el usuario pasa a inhabilitado, se cierra la sesión y se notifica null.
 */
export function subscribeAuthChanges(
  onUser: (user: AuthUser | null) => void
): UnsubscribeFn {
  const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
    if (!fbUser) return onUser(null);

    try {
      const disabled = await isUserDisabled(fbUser.uid);
      if (disabled) {
        await fbSignOut(auth);
        return onUser(null);
      }
    } catch {
      // Falla de red/Firestore: no bloqueamos aquí.
      // El guard post-login protege el acceso.
    }

    const user: AuthUser = { uid: fbUser.uid, email: fbUser.email };
    onUser(user);
  });

  return unsubscribe;
}
