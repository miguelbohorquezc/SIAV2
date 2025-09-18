# Roadmap – aspirantes-admin
Fecha: 2025-09-18

## Sub-tareas completadas
1. Setup inicial de feature `aspirantes-admin` (estructura de páginas, hooks, servicio stub).
2. Servicio mock + hook conectado con paginación local.
3. Conexión Firestore (listado básico, orden por `createdAt`).
4. Manejo de errores mapeado a `ERROR_KEYS` en hook.
5. Carga inicial y setters que disparan `load`.
6. **Paginación real con cursores (`startAfter`)**:  
   - Servicio retorna `{ items, total, cursor, hasNext }`.  
   - Hook guarda cursores por página y expone `state.hasNext`.  

## Sub-tareas pendientes
7. **UI hasNext**: deshabilitar botón *Siguiente* en `ApplicantsTable` usando `state.hasNext`.  
8. **Filtros/Orden**: agregar filtros por `estado` y `gradoAplicado` + orden secundario estable.  
9. **Acción toggleFlag**: permitir marcar aspirante como público (optimista con rollback).  
10. **Exportación CSV**: exportar página actual en `.csv`.  
11. **Feature toggles/ventanas**: consumir `config/{anioLectivo}/features` y `ventanas` (read-only).  
12. **Auditoría**: escribir en `audits/` en cada mutación.  
13. **Errores uniformes**: mapear todos a `ERROR_KEYS` y feedback visual.  
14. **Rendimiento**: búsqueda por texto en servidor (índices de prefijo).  
15. **Consistencia de tipos/constantes**: unificar DTO y extraer literales a `shared/`.  
16. **Cierre de feature**: documentación final con pruebas manuales.

## Próxima sub-tarea
- **Sub-tarea 7:** UI `hasNext` en `ApplicantsTable` (1 archivo).  
- Commit esperado:  
