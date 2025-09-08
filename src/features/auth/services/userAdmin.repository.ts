/**
 * Admin de usuarios (Coordinación/Secretaría):
 * - Listar usuarios
 * - Crear e invitar (email de reset)
 * - Actualizar rol/estado/displayName
 * - Enviar reset de contraseña a terceros
 */
import {
  collection, doc, getDocs, limit, orderBy, query, setDoc, updateDoc, where,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword, sendPasswordResetEmail, signOut,
} from 'firebase/auth';
import { db } from '@/infrastructure/firebase/firebase';
import { getSecondaryAuth } from '@/infrastructure/firebase/secondaryApp';
import { USER_STATUS, type Role, type UserStatus } from '@/shared/constants/roles';

export interface AppUser {
  uid: string;
  email: string;
  displayName?: string | null;
  role: Role;
  status: UserStatus;
  createdAt: number;
  updatedAt: number;
}

export interface CreateUserInput {
  email: string;
  displayName?: string;
  role: Role;
}

export interface UpdateUserInput {
  uid: string;
  role?: Role;
  status?: UserStatus;
  displayName?: string | null;
}

const USERS = 'users';

export async function listUsers(args: {
  role?: Role; status?: UserStatus; qText?: string; pageSize?: number;
} = {}): Promise<AppUser[]> {
  const col = collection(db, USERS);
  const filters: any[] = [];
  if (args.role) filters.push(where('role', '==', args.role));
  if (args.status) filters.push(where('status', '==', args.status));
  // Nota: para búsqueda por email avanzada, usar índices con startsWith; aquí listamos por fecha
  const qry = query(col, ...filters, orderBy('createdAt', 'desc'), limit(args.pageSize ?? 25));
  const snap = await getDocs(qry);
  return snap.docs.map(d => {
    const data = d.data() as any;
    return {
      uid: d.id,
      email: String(data.email ?? ''),
      displayName: data.displayName ?? null,
      role: String(data.role ?? 'DOCENTE') as Role,
      status: String(data.status ?? 'ACTIVE') as UserStatus,
      createdAt: Number(data.createdAt ?? Date.now()),
      updatedAt: Number(data.updatedAt ?? Date.now()),
    };
  });
}

/**
 * Crea usuario en Auth usando app secundaria (no rompe sesión actual),
 * guarda su doc en /users/{uid} y envía email de reset para que defina contraseña.
 */
export async function createUserAndInvite(input: CreateUserInput): Promise<AppUser> {
  const secondaryAuth = getSecondaryAuth();
  const tempPassword = crypto.randomUUID().slice(0, 12) + 'Aa1';

  const cred = await createUserWithEmailAndPassword(secondaryAuth, input.email, tempPassword);

  try {
    const now = Date.now();
    const newUser: AppUser = {
      uid: cred.user.uid,
      email: input.email,
      displayName: input.displayName ?? null,
      role: input.role,
      status: USER_STATUS.ACTIVE,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(db, USERS, newUser.uid), {
      email: newUser.email,
      displayName: newUser.displayName,
      role: newUser.role,
      status: newUser.status,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    });

    await sendPasswordResetEmail(secondaryAuth, input.email);
    return newUser;
  } finally {
    await signOut(secondaryAuth).catch(() => {});
  }
}

export async function updateUserRoleStatus(input: UpdateUserInput): Promise<void> {
  const patch: Record<string, unknown> = { updatedAt: Date.now() };
  if (typeof input.role !== 'undefined') patch.role = input.role;
  if (typeof input.status !== 'undefined') patch.status = input.status;
  if (typeof input.displayName !== 'undefined') patch.displayName = input.displayName;
  await updateDoc(doc(db, USERS, input.uid), patch);
}

export async function sendPasswordResetForUser(email: string): Promise<void> {
  const secondaryAuth = getSecondaryAuth();
  try {
    await sendPasswordResetEmail(secondaryAuth, email);
  } finally {
    await signOut(secondaryAuth).catch(() => {});
  }
}
