# Avance – aspirantes-admin

Fecha: 2025-09-17

## Resumen

* Se diseñó la feature **aspirantes-admin** tomando en cuenta los avances existentes en **SIAV2**:

  * Formulario público de aspirantes (wizard 5 pasos, validaciones, términos).
  * Avance inicial en la tabla de administración de aspirantes (listado, estados básicos).
* Se definió el objetivo: permitir a **SECRETARIA** gestionar aspirantes (estados, checklist documental, pase a matrícula) y a **COORDINADOR** exportar/organizar matriculados.
* Se agregó la lógica de **reinicio anual (YEAR\_ROLLOVER)** para iniciar cada ciclo escolar.
* Se contempló un **bridge de matrícula** (folio con prefill) ya que SIAV2 aún no tiene la feature completa de matrícula.

## Cambios

* **Estados del aspirante**: `en_espera`, `en_proceso`, `admitido`, `no_admitido`.
* **Checklist documental**: documentos físicos requeridos que habilitan el botón *Matricular*.
* **Botón Matricular**: sólo habilitado si aspirante = admitido, checklist completo, y sin matrícula previa.
* **Export**: descarga de matriculados por grado en CSV, con auditoría.
* **Roles**:

  * **SECRETARIA**: gestión de aspirantes y checklist, creación de matrícula (bridge).
  * **COORDINADOR**: exportar matriculados, asignar grupos A/B/C (cuando exista vista).
  * **ACUDIENTES**: acceso público a formularios y consulta de estado.
* **Reinicio anual**: cierre de año N → creación de `anioLectivo = N+1`, cierre de ventanas, reinicio de formularios y checklists, auditoría `YEAR_ROLLOVER`.

## TODO próximo turno

* Sub‑tarea 2: implementar `readyToEnroll` en `services/aspirantesAdmin.service.ts` y conectar al botón *Matricular* en la página.
* Sub‑tarea 3: implementar modales de cambio de estado (`admitir`, `no_admitir`, `reabrir`) con validación de motivo y auditoría.
* Sub‑tarea 4: conectar el **matricula bridge** para crear folio en Firestore.
* Sub‑tarea 5: export CSV con filtros por grado y año.
* Sub‑tarea 6: vista de asignación (COORDINADOR) para grupos A/B/C.
* Sub‑tarea 7: métricas y ficha imprimible (cuando exista matrícula completa).

## Pruebas manuales

* **Caso feliz**: Aspirante admitido, checklist documental completo → botón *Matricular* habilitado → se crea folio de matrícula → auditoría `MATRICULA_CREATE`.
* **Edge case**: Aspirante admitido pero falta `certEPS` en checklist → botón *Matricular* deshabilitado, tooltip lista documentos faltantes.
* **Error remoto**: Fallo al escribir auditoría → acción se cancela, aspirante no cambia de estado y se muestra mensaje de error.

## Commits sugeridos

```
feat(aspirantes-admin): definición de feature con checklist documental, matrícula bridge, export y reinicio anual
```

---

## 17) Control de activación de formularios (SECRETARIA)

**Objetivo:** permitir que Secretaría defina si los formularios públicos de **Aspirantes** y **Matrícula** están disponibles o no para los acudientes.

### 17.1 Estrategia

* Agregar un campo de configuración global por `anioLectivo` en Firestore, ej.: `config/{anioLectivo}/formularios`.
* Campos booleanos: `aspirantesActivo`, `matriculasActivo`.
* Los componentes públicos (`AspiranteFormulario`, `MatriculaFormulario`) ya contemplan `isEnabled` → se alimentarán de esta configuración.

### 17.2 Flujo (SECRETARIA)

1. Desde panel de configuración (rol SECRETARIA):

   * Puede alternar **activar/desactivar** el formulario de Aspirantes.
   * Puede alternar **activar/desactivar** el formulario de Matrícula.
2. Al guardar:

   * Se actualiza config en Firestore con auditoría `FORM_ACTIVATION`.
   * Cambios se reflejan en tiempo real en los formularios públicos.

### 17.3 Criterios de aceptación

* **Dado** que `aspirantesActivo=false`, **cuando** un acudiente entra al formulario de aspirantes, **entonces** ve mensaje de “Formulario temporalmente inactivo” (ya implementado en UI).
* **Dado** que Secretaría cambia `aspirantesActivo=true`, **cuando** un acudiente recarga, **entonces** puede usar el formulario completo.
* **Dado** que `matriculasActivo=false`, **cuando** un acudiente admitido intenta abrir matrícula, **entonces** ve mensaje de inactividad.
* **Y** todos los cambios de activación quedan registrados con auditoría (`actorUid`, `anioLectivo`, `formulario`, `valorAnterior`, `valorNuevo`).

### 17.4 Roles y permisos

* **SECRETARIA**: puede activar/desactivar formularios.
* **COORDINADOR**: sólo lectura del estado de activación.
* **ACUDIENTE**: sólo consulta indirecta (usa valor para habilitar o no el formulario).

---

## Control de activación de formularios (SECRETARIA)

**Objetivo:** permitir que **SECRETARIA** (o ADMIN) **active/desactive** los formularios **Aspirantes** y **Matrícula** por **año lectivo**, y defina **ventanas** (apertura/cierre) desde un panel de configuración.

### Modelo de configuración (sin código)

* `config/anioLectivoActual: number|string`
* `config/features: { aspirantes: { enabled: boolean }, matricula: { enabled: boolean } }`
* `config/ventanas: { aspirantes: { abre: timestamp, cierra: timestamp }, matricula: { abre: timestamp, cierra: timestamp } }`
* Auditoría de cambios en `config/audits/*` con `action: 'FEATURE_TOGGLE_UPDATE' | 'WINDOWS_UPDATE' | 'YEAR_ROLLOVER'`.

### Reglas

1. Un formulario **se muestra como inactivo** si `enabled=false` **o** la fecha actual **no** está dentro de la ventana (`abre ≤ now ≤ cierra`).
2. En **público**, si está inactivo: mostrar **tarjeta informativa** (ya existe en ambos formularios) sin exponer datos.
3. En **admin**, sólo usuarios con rol **SECRETARIA** (o **ADMIN**) pueden modificar `enabled` y fechas.
4. Todo cambio queda **auditado** (quién, cuándo, valores antes/después).

### Criterios de aceptación (Gherkin)

* **Dado** que `features.aspirantes.enabled=false`, **cuando** un acudiente entra al formulario de aspirantes, **entonces** ve el mensaje “Formulario temporalmente inactivo” y **no** puede enviar.
* **Dado** que `features.matricula.enabled=true` pero hoy es **antes** de `ventanas.matricula.abre`, **cuando** entro al formulario de matrícula, **entonces** se muestra como **inactivo**.
* **Dado** un usuario con rol **SECRETARIA**, **cuando** marca `enabled=true` y define `abre`/`cierra`, **entonces** el formulario se **habilita** para el intervalo y se registra `FEATURE_TOGGLE_UPDATE` y `WINDOWS_UPDATE`.
* **Dado** que el rango expira (fecha > `cierra`), **cuando** intento acceder al formulario, **entonces** se muestra **inactivo** automáticamente.

### UI sugerida (admin)

* **Configuración → Formularios**

  * Tarjetas: **Aspirantes** y **Matrícula** con switches `enabled` y pickers `abre/cierra`.
  * Badge de estado: *Activo / Inactivo / Fuera de ventana*.
  * Botón **Guardar** (valida rangos y superposiciones), con resumen de cambios y confirmación.

### Impacto en flujos existentes

* No cambia lógica de envío: ambos formularios ya tienen vista **inactiva** disponible y se conectan a estos flags.
* El **cierre anual** puede **apagar** ambos formularios del año N y **habilitar** los del N+1 en la misma operación (ver `YEAR_ROLLOVER`).

### TODO vinculado

* Añadir constantes/keys en `shared/constants/config.constants.ts` (sin implementar IO todavía).
* Ajustar hooks `useAspiranteFormulario` y `useMatriculaForm` para leer `enabled`/`ventanas` desde servicio de configuración.
* Añadir auditoría `FEATURE_TOGGLE_UPDATE` y `WINDOWS_UPDATE`.
