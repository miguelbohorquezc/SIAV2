# Admin Matrícula (SECRETARIA)

## Probar rápido
1. Inicia la app con un usuario rol **SECRETARIA**.
2. Visita **/admin/matriculas** para listar y filtrar.
3. Abre un registro y usa las tabs: **Datos**, **Documentos**, **Auditoría**.
4. Marca documentos requeridos → botón **Matricular** se habilita.
5. **Revocar** o **Retirar** piden motivo y registran auditoría.
6. **Imprimir ficha** genera vista imprimible.
7. **Exportar** en **/admin/matriculas/export** (CSV con extensión `.xls`).
8. **Preparar ciclo** (exponer por consola `prepararCiclo(anio)` o vía UI futura).

> Servicios usan `db/auth` desde `infrastructure/firebase`. Redux expone `reducerKey` + `reducer`.
