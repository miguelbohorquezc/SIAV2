# Admisiones - Aspirantes

## Probar
1. Iniciar sesión con rol `SECRETARIA` o `COORDINADOR`.
2. Ir a **/admin/aspirantes**: ver tabla, filtrar por texto/estado/tag/autorizar y paginar.
3. Entrar a **/admin/aspirantes/:id**: cambiar `estado` (si `no_admitido` pide motivo), editar `fuente` y `tags`.
4. Autorizar matrícula (modal): marca `autorizado*` y crea audit.
5. Abrir **/admin/aspirantes/:id/ficha** y presionar *Imprimir*: registra audit `print`.
6. Exportar CSV desde el listado (client-side).
7. Ver sincronización ligera con `syncRecent()` si se integra en efectos globales.
