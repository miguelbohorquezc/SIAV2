import { auth } from '@/infrastructure/firebase/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import type { AuthUser } from '../types';

export type UnsubscribeFn = () => void;

export async function configureAuthPersistence(): Promise<void> {
  await setPersistence(auth, browserLocalPersistence);
}

export function subscribeAuthChanges(
  onUser: (user: AuthUser | null) => void
): UnsubscribeFn {
  const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
    if (!fbUser) return onUser(null);
    const user: AuthUser = { uid: fbUser.uid, email: fbUser.email };
    onUser(user);
  });
  return unsubscribe;
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return { uid: res.user.uid, email: res.user.email };
}

export async function register(email: string, password: string): Promise<AuthUser> {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  return { uid: res.user.uid, email: res.user.email };
}

export async function requestPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function signOut(): Promise<void> {
  await fbSignOut(auth);
}
