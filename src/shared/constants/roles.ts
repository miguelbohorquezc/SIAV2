export const ROLES = {
  DOCENTE: 'DOCENTE',
  COORDINADOR: 'COORDINADOR',
  SECRETARIA: 'SECRETARIA',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];
