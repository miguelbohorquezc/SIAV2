# Avance – Bloqueo de usuarios inhabilitados (Auth)
Fecha: 2025-09-11

## Resumen
- Se implementó un **guard de habilitación** en el flujo de autenticación.
- Si un usuario tiene `active=false` o `status="INACTIVE"` en su documento `users/{uid}`, se le bloquea el inicio de sesión y se expulsa si está logueado.
- Se agregó soporte a `configureAuthPersistence`, `register` y `requestPasswordReset` en `auth.repository.ts` para mantener compatibilidad con thunks existentes.

## Cambios
- **Modificado**: `src/features/auth/services/auth.repository.ts`
  - Nuevo helper `isUserDisabled`.
  - Guard post-login en `signIn`.
  - Expulsión en `subscribeAuthChanges`.
  - Función `configureAuthPersistence`.
  - Funciones `register` y `requestPasswordReset`.
- No se agregaron dependencias nuevas.
- Se mantiene compatibilidad con `errorMap` y `ERROR_KEYS.AUTH_USER_DISABLED`.

## Commits sugeridos
```
feat(auth): bloquear login y sesión de usuarios inhabilitados

- Guard en signIn: consulta users/{uid}.active/status
- Expulsión automática en subscribeAuthChanges
- Nuevo configureAuthPersistence, register y requestPasswordReset
- Sin deps nuevas; mantiene compatibilidad con errorMap
```

## TODO próximo turno
- Validar integración con slice de `auth` en Redux: mostrar mensaje de error en UI con `error.code = 'auth/user-disabled'`.
- Opcional: centralizar nombre de colección `users` en `shared/constants/collections.ts`.
- Revisar reglas de seguridad en Firestore para que solo admins puedan modificar `active` o `status`.

## Pruebas manuales
- **Caso feliz**: usuario con `active=true` y/o `status=ACTIVE` inicia sesión correctamente y permanece logueado.  
- **Edge case**: usuario logueado pasa a `active=false` → el listener expulsa automáticamente.  
- **Error remoto**: caída de Firestore en el listener → la sesión no se rompe, el guard post-login protege en el siguiente login.
