# matriculaForm

Formulario público `/matricula` con verificación por identificación, precarga opcional y envío único por año.

## Probar
1. Crear doc `featureFlags/matriculaForm` con `{ enabled: true, anio: 2025, termsVersion: 1 }`.
2. Ir a `/matricula`. Ver paso de Verificación, continuar el wizard.
3. Enviar: se crea `matriculas/{tipoId-numeroId-anio}` con `estado='en_revision'`.
4. Duplicado: al repetir la verificación con mismo ID+anio, muestra bloqueo.
5. Cerrar: poner `enabled=false` y recargar -> se muestra “Formulario cerrado”.
