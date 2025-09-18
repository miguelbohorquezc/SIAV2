# Avance – aspirantes-admin
Fecha: 2025-09-17

## Resumen
- Se completó el servicio `aspirantesAdmin.service.ts` con integración real a Firestore (orden por `createdAt desc`).
- Se implementó filtrado: exacto por documento en servidor, texto normalizado (acentos-insensible) en cliente.
- Se ajustó el hook `useAspirantesAdmin.ts`:
  - Carga inicial automática.
  - Setters (`setPage`, `setPageSize`, `setFilter`) disparan carga real.
  - Manejo de errores centralizado con `ERROR_KEYS.ASPIRANTES_LIST_FAILED`.
- Paginación todavía con total estimado; siguiente sub-tarea incluirá cursores `startAfter`.

## Cambios
- `src/features/aspirantes-admin/services/aspirantesAdmin.service.ts`
- `src/features/aspirantes-admin/hooks/useAspirantesAdmin.ts`

## Commits sugeridos
