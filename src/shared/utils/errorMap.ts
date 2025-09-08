import type { FirebaseError } from 'firebase/app';
import { ERROR_KEYS, ERROR_MESSAGES_ES } from '@/shared/constants/errors';

// Auth
export function mapFirebaseAuthError(err: unknown): string {
  const e = err as FirebaseError | undefined;
  const code = e?.code ?? '';
  switch (code) {
    case 'auth/invalid-email': return ERROR_MESSAGES_ES[ERROR_KEYS.AUTH_INVALID_EMAIL];
    case 'auth/user-disabled': return ERROR_MESSAGES_ES[ERROR_KEYS.AUTH_USER_DISABLED];
    case 'auth/user-not-found': return ERROR_MESSAGES_ES[ERROR_KEYS.AUTH_USER_NOT_FOUND];
    case 'auth/wrong-password': return ERROR_MESSAGES_ES[ERROR_KEYS.AUTH_WRONG_PASSWORD];
    case 'auth/too-many-requests': return ERROR_MESSAGES_ES[ERROR_KEYS.AUTH_TOO_MANY_ATTEMPTS];
    case 'auth/network-request-failed': return ERROR_MESSAGES_ES[ERROR_KEYS.AUTH_NETWORK];
    case 'auth/popup-blocked': return ERROR_MESSAGES_ES[ERROR_KEYS.AUTH_POPUP_BLOCKED];
    case 'auth/email-already-in-use': return ERROR_MESSAGES_ES[ERROR_KEYS.AUTH_EMAIL_IN_USE];
    case 'auth/weak-password': return ERROR_MESSAGES_ES[ERROR_KEYS.AUTH_WEAK_PASSWORD];
    case 'auth/operation-not-allowed': return ERROR_MESSAGES_ES[ERROR_KEYS.AUTH_OPERATION_NOT_ALLOWED];
    default: return ERROR_MESSAGES_ES[ERROR_KEYS.UNKNOWN];
  }
}

// Firestore
export function mapFirestoreError(err: unknown): string {
  const e = err as { code?: string } | undefined;
  const code = e?.code ?? '';
  if (code.includes('permission-denied')) return ERROR_MESSAGES_ES[ERROR_KEYS.FS_PERMISSION_DENIED];
  if (code.includes('not-found')) return ERROR_MESSAGES_ES[ERROR_KEYS.FS_NOT_FOUND];
  if (code.includes('unavailable')) return ERROR_MESSAGES_ES[ERROR_KEYS.FS_UNAVAILABLE];
  return ERROR_MESSAGES_ES[ERROR_KEYS.UNKNOWN];
}
