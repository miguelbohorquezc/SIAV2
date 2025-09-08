import type { Role, UserStatus } from '@/shared/constants/roles';

export interface AppUser {
  uid: string;
  email: string;
  displayName?: string;
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

export interface CreateUserWithPasswordInput extends CreateUserInput {
  password: string;
  /** Si es true además de crear, envía correo de restablecimiento para que el usuario pueda cambiar su clave. */
  sendInvite?: boolean;
}

export interface UpdateUserInput {
  uid: string;
  role?: Role;
  status?: UserStatus;
  displayName?: string | null;
}
