import type { AppUser } from '../types';

export function toDomain(uid: string, data: any): AppUser {
  return {
    uid,
    email: String(data.email ?? ''),
    displayName: data.displayName ? String(data.displayName) : undefined,
    role: String(data.role ?? ''),
    status: String(data.status ?? 'ACTIVE') as any,
    createdAt: Number(data.createdAt ?? Date.now()),
    updatedAt: Number(data.updatedAt ?? Date.now()),
  } as AppUser;
}

export function toDTO(u: AppUser) {
  return {
    email: u.email,
    displayName: u.displayName ?? null,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}
