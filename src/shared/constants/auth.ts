// Roles y textos de Auth centralizados (anti-hardcode)
export const AUTH_ROLES = {
  DOCENTE: 'DOCENTE',
  COORDINADOR: 'COORDINADOR',
  SECRETARIA: 'SECRETARIA',
} as const;

export type Role = keyof typeof AUTH_ROLES | 'DOCENTE' | 'COORDINADOR' | 'SECRETARIA';

export const AUTH_MESSAGES = {
  REQUIRED_EMAIL: 'El correo es obligatorio',
  REQUIRED_PASSWORD: 'La contraseña es obligatoria',
  INVALID_CREDENTIALS: 'Credenciales inválidas',
  UNKNOWN_ERROR: 'Ocurrió un error inesperado. Intenta de nuevo.',
  RESTRICTED: 'Acceso restringido. Contacte al coordinador.',
};
