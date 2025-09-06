// Compatibilidad: la persistencia ya se configura en firebase.ts con initializeFirestore().
// Este archivo queda como no-op para evitar advertencias e imports rotos.

export async function configureFirestorePersistence(): Promise<void> {
  // No es necesario hacer nada aquí.
  return;
}
