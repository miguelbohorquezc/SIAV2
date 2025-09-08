import {
  collection, doc, getDocs, limit, orderBy, query, setDoc, updateDoc, where,
  startAt, endAt,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  type ActionCodeSettings,
} from 'firebase/auth';
import { db } from '@/infrastructure/firebase/firebase';
import { getSecondaryAuth } from '@/infrastructure/firebase/secondaryApp';
import { toDomain, toDTO } from './mapper';
import type {
  AppUser,
  CreateUserInput,
  CreateUserWithPasswordInput,
  UpdateUserInput,
} from '../types';
import { USER_STATUS } from '@/shared/constants/roles';

const USERS = 'users';

function buildActionCodeSettings(): ActionCodeSettings {
  const base = import.meta.env.VITE_AUTH_CONTINUE_URL || `${window.location.origin}/login`;
  return {
    url: base,
    handleCodeInApp: false,
  };
}

export async function listUsers({
  role, status, qText, pageSize = 25,
}: { role?: string; status?: string; qText?: string; pageSize?: number; }): Promise<AppUser[]> {
  const col = collection(db, USERS);
  const filters: any[] = [];
  if (role) filters.push(where('role', '==', role));
  if (status) filters.push(where('status', '==', status));

  try {
    let qry;
    if (qText && qText.trim()) {
      const needle = qText.trim().toLowerCase();
      qry = query(
        col,
        ...filters,
        orderBy('emailLower'),
        startAt(needle),
        endAt(needle + '\uf8ff'),
        limit(pageSize),
      );
    } else {
      qry = query(col, ...filters, orderBy('createdAt', 'desc'), limit(pageSize));
    }
    const snap = await getDocs(qry);
    return snap.docs.map(d => toDomain(d.id, d.data()));
  } catch {
    // Fallback sin índice
    const snap = await getDocs(query(col, orderBy('createdAt', 'desc'), limit(100)));
    const all = snap.docs.map(d => toDomain(d.id, d.data()));
    if (!qText) return all;
    const needle = qText.toLowerCase();
    return all
      .filter(u =>
        (u.email?.toLowerCase().includes(needle)) ||
        ((u.displayName ?? '').toLowerCase().includes(needle)))
      .slice(0, pageSize);
  }
}

/** Crea usuario con contraseña definida y opcionalmente envía email de invitación (reset). */
export async function createUserWithPassword(input: CreateUserWithPasswordInput): Promise<AppUser> {
  const secondaryAuth = getSecondaryAuth();
  secondaryAuth.languageCode = 'es';

  const cred = await createUserWithEmailAndPassword(secondaryAuth, input.email, input.password);

  try {
    const newUser: AppUser = {
      uid: cred.user.uid,
      email: input.email,
      displayName: input.displayName,
      role: input.role,
      status: USER_STATUS.ACTIVE,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const dto = { ...toDTO(newUser), emailLower: input.email.toLowerCase() };
    await setDoc(doc(db, USERS, newUser.uid), dto);

    if (input.sendInvite) {
      await sendPasswordResetEmail(secondaryAuth, input.email, buildActionCodeSettings());
    }
    return newUser;
  } finally {
    await signOut(secondaryAuth).catch(() => {});
  }
}

/** Compat: crea con contraseña temporal y envía invitación siempre. */
export async function createUserAndInvite(input: CreateUserInput): Promise<AppUser> {
  const tempPassword = crypto.randomUUID().slice(0, 12) + 'Aa1';
  return createUserWithPassword({ ...input, password: tempPassword, sendInvite: true } as any);
}

/** Actualiza solo los campos presentes (nunca undefined). */
export async function updateUserRoleStatus(
  input: UpdateUserInput,
): Promise<{ uid: string; changes: Partial<AppUser> }> {
  const ref = doc(db, USERS, input.uid);
  const changes: Partial<AppUser> = { updatedAt: Date.now() };
  if (typeof input.role !== 'undefined') changes.role = input.role as any;
  if (typeof input.status !== 'undefined') changes.status = input.status as any;
  if (typeof input.displayName !== 'undefined') changes.displayName = input.displayName ?? undefined;

  const patch: Record<string, unknown> = { updatedAt: changes.updatedAt };
  if (typeof changes.role !== 'undefined') patch.role = changes.role;
  if (typeof changes.status !== 'undefined') patch.status = changes.status;
  if (typeof input.displayName !== 'undefined') patch.displayName = input.displayName ?? null;

  await updateDoc(ref, patch);
  return { uid: input.uid, changes };
}

/** Reset para terceros con continueUrl. */
export async function sendPasswordResetForUser(email: string): Promise<void> {
  const secondaryAuth = getSecondaryAuth();
  secondaryAuth.languageCode = 'es';
  try {
    await sendPasswordResetEmail(secondaryAuth, email, buildActionCodeSettings());
  } finally {
    await signOut(secondaryAuth).catch(() => {});
  }
}
