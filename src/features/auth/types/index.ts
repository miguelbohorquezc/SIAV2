import type { Role } from '@/shared/constants/auth';

// Error tipado para la feature
export class AuthFeatureError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'AuthFeatureError';
    this.code = code;
  }
}

// Usuario mínimo en estado de la app
export interface AuthUser {
  uid: string;
  email: string | null;
}

// DTO almacenado en Firestore
export interface UserProfileDTO {
  uid: string;
  email: string;
  role: Role;
  displayName?: string;
  active?: boolean;
}

// Modelo de dominio
export interface UserProfile {
  uid: string;
  email: string;
  role: Role;
  displayName?: string;
  active: boolean;
}
