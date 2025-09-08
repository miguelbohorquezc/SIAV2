// i18n keys + mensajes por defecto en ES
export const ERROR_KEYS = {
  AUTH_INVALID_EMAIL: 'auth.invalid_email',
  AUTH_USER_DISABLED: 'auth.user_disabled',
  AUTH_USER_NOT_FOUND: 'auth.user_not_found',
  AUTH_WRONG_PASSWORD: 'auth.wrong_password',
  AUTH_TOO_MANY_ATTEMPTS: 'auth.too_many_attempts',
  AUTH_NETWORK: 'auth.network',
  AUTH_POPUP_BLOCKED: 'auth.popup_blocked',
  AUTH_EMAIL_IN_USE: 'auth.email_already_in_use',
  AUTH_WEAK_PASSWORD: 'auth.weak_password',
  AUTH_OPERATION_NOT_ALLOWED: 'auth.operation_not_allowed',
  FS_PERMISSION_DENIED: 'firestore.permission_denied',
  FS_NOT_FOUND: 'firestore.not_found',
  FS_UNAVAILABLE: 'firestore.unavailable',
  UNKNOWN: 'unknown',
} as const;

export const ERROR_MESSAGES_ES: Record<string, string> = {
  [ERROR_KEYS.AUTH_INVALID_EMAIL]: 'El correo no es válido.',
  [ERROR_KEYS.AUTH_USER_DISABLED]: 'La cuenta está deshabilitada.',
  [ERROR_KEYS.AUTH_USER_NOT_FOUND]: 'No existe una cuenta con este correo.',
  [ERROR_KEYS.AUTH_WRONG_PASSWORD]: 'La contraseña es incorrecta.',
  [ERROR_KEYS.AUTH_TOO_MANY_ATTEMPTS]: 'Demasiados intentos. Intenta más tarde.',
  [ERROR_KEYS.AUTH_NETWORK]: 'Problema de red. Verifica tu conexión.',
  [ERROR_KEYS.AUTH_POPUP_BLOCKED]: 'El navegador bloqueó la ventana emergente.',
  [ERROR_KEYS.AUTH_EMAIL_IN_USE]: 'El correo ya está en uso.',
  [ERROR_KEYS.AUTH_WEAK_PASSWORD]: 'La contraseña es muy débil.',
  [ERROR_KEYS.AUTH_OPERATION_NOT_ALLOWED]: 'Operación no permitida.',
  [ERROR_KEYS.FS_PERMISSION_DENIED]: 'No tienes permisos para esta operación.',
  [ERROR_KEYS.FS_NOT_FOUND]: 'El recurso no existe.',
  [ERROR_KEYS.FS_UNAVAILABLE]: 'Servicio no disponible. Intenta más tarde.',
  [ERROR_KEYS.UNKNOWN]: 'Ocurrió un error inesperado.',
};
