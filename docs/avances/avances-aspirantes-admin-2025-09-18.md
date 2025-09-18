# Avance – aspirantes-admin (Sub-tarea 6)
Fecha: 2025-09-18

## Resumen
- Se implementó paginación real en Firestore usando **cursores (`startAfter`)**.
- El servicio `aspirantesAdmin.service.ts` ahora:
  - Retorna `items`, `total` estimado, `cursor` (último doc de la página) y `hasNext`.
  - Detecta si existe página siguiente al pedir `pageSize+1`.
  - Mantiene compatibilidad con filtros:
    - Exacto por documento numérico → ignora cursores (consulta única).
    - Texto → aplica filtrado en cliente tras la consulta.
- El hook `useAspirantesAdmin.ts` ahora:
  - Guarda cursores por página (`Map<number, QueryDocumentSnapshot>`).
  - Usa el cursor de la página previa para avanzar.
  - Limpia cursores al cambiar `pageSize` o `filtro`.
  - Expone `state.hasNext` para deshabilitar botón “Siguiente” en la UI.

## Cambios
- `src/features/aspirantes-admin/services/aspirantesAdmin.service.ts`
- `src/features/aspirantes-admin/hooks/useAspirantesAdmin.ts`

## Commit sugerido


## TODO próximo turno
- Integrar `state.hasNext` en la tabla (`ApplicantsTable`) para deshabilitar botón **Siguiente** cuando no haya más páginas.
- Sub-tarea siguiente: implementar `toggleFlag` (marcar aspirante como público) y preparar exportación CSV.
- Conectar feature toggles/ventanas (`config/{anioLectivo}`) desde Firestore.

## Pruebas manuales
- **Caso feliz:** abrir `/admin/aspirantes` → carga inicial con N registros; al pulsar *Siguiente* avanza a la página 2 con nuevos registros.  
- **Edge case:** cambiar `pageSize` a 50 → se reinician cursores, vuelve a página 1 y recarga correctamente.  
- **Error remoto:** desconectar red y recargar → tabla vacía, `error = ERROR_KEYS.ASPIRANTES_LIST_FAILED`, sin romper UI.
