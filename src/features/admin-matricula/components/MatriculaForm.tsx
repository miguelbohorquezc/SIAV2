import { useEffect, useMemo, useState } from 'react';
import type { Matricula } from '../store/slice';
import ConfirmModal from './ConfirmModal';

/**
 * Formulario completo para editar la matrícula.
 * - UX Bulma (light)
 * - Controlado con estado local
 * - Botón Guardar con confirmación
 * - Bloquea Guardar si no hay cambios o hay errores simples
 * - onSave(payload) envía SOLO los campos modificados (parcial)
 */
type Props = {
  value: Matricula;
  onChange?: (draft: Partial<Matricula>) => void;
  onSave: (payload?: Partial<Matricula>) => void | Promise<void>;
};

type Draft = Partial<Matricula>;

const ESTADOS: Matricula['estado'][] = [
  'en_revision',
  'pendiente',
  'matriculado',
  'rechazado',
  'retirado',
  'revocado',
];

const FIELDSET = {
  estudiante: [
    { key: 'nombres', label: 'Nombres', type: 'text' },
    { key: 'apellidos', label: 'Apellidos', type: 'text' },
    { key: 'fechaNacimiento', label: 'Fecha de nacimiento', type: 'date' },
    { key: 'lugarNacimiento', label: 'Lugar de nacimiento', type: 'text' },
    { key: 'barrio', label: 'Barrio', type: 'text' },
    { key: 'ciudad', label: 'Ciudad', type: 'text' },
    { key: 'direccion', label: 'Dirección', type: 'text' },
    { key: 'telefono', label: 'Teléfono', type: 'tel' },
    { key: 'colegioAnterior', label: 'Colegio anterior', type: 'text' },
    { key: 'fuente', label: 'Fuente', type: 'text' },
  ],
  acudiente: [
    { group: 'padre', title: 'Padre' },
    { group: 'madre', title: 'Madre' },
  ],
};

const safe = <T,>(v: T | null | undefined, fallback: T): T => (v == null ? fallback : v);

export default function MatriculaForm({ value, onChange, onSave }: Props) {
  // ---- Estado local (borrador) ----
  const [draft, setDraft] = useState<Draft>(() => ({
    anio: value.anio,
    estado: value.estado,
    gradoAnterior: safe(value.gradoAnterior, ''),
    gradoAspira: value.gradoAspira,
    estudiante: { ...value.estudiante },
    verificacion: { ...value.verificacion },
    padre: value.padre ? { ...value.padre } : { nombres: '', apellidos: '', numeroIdentificacion: '', email: '', telefono: '', direccion: '', empresa: '', cargo: '', ciudad: '' },
    madre: value.madre ? { ...value.madre } : { nombres: '', apellidos: '', numeroIdentificacion: '', email: '', telefono: '', direccion: '', empresa: '', cargo: '', ciudad: '' },
    responsable: value.responsable ? { ...value.responsable } : { quienAsumeCostos: '', seComprometePrimeros10Dias: false },
  }));

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'is-success' | 'is-danger'; msg: string } | null>(null);

  // ---- Derivados ----
  const diffPayload = useMemo<Partial<Matricula>>(() => {
    const p: Partial<Matricula> = {};
    const assignIfChanged = <K extends keyof Matricula>(k: K, val: Matricula[K]) => {
      const original = value[k];
      const changed = JSON.stringify(original) !== JSON.stringify(val);
      if (changed) (p as any)[k] = val;
    };

    assignIfChanged('anio', Number(draft.anio ?? value.anio));
    assignIfChanged('estado', (draft.estado ?? value.estado) as Matricula['estado']);
    assignIfChanged('gradoAnterior', safe(draft.gradoAnterior, ''));
    assignIfChanged('gradoAspira', String(draft.gradoAspira ?? value.gradoAspira).trim());
    assignIfChanged('estudiante', { ...value.estudiante, ...(draft.estudiante || {}) });
    assignIfChanged('verificacion', { ...value.verificacion, ...(draft.verificacion || {}) });
    assignIfChanged('padre', { ...(value.padre || {}), ...(draft.padre || {}) });
    assignIfChanged('madre', { ...(value.madre || {}), ...(draft.madre || {}) });
    assignIfChanged('responsable', { ...(value.responsable || {}), ...(draft.responsable || {}) });

    return p;
  }, [draft, value]);

  const isDirty = Object.keys(diffPayload).length > 0;

  const errors = useMemo(() => {
    const errs: string[] = [];
    const est = draft.estudiante || value.estudiante;
    const ver = draft.verificacion || value.verificacion;

    if (!safe(est.nombres, '').trim()) errs.push('El campo Nombres es obligatorio.');
    if (!safe(est.apellidos, '').trim()) errs.push('El campo Apellidos es obligatorio.');
    if (!safe(ver.tipoId, '').trim()) errs.push('El campo Tipo de identificación es obligatorio.');
    if (!safe(ver.numeroId, '').trim()) errs.push('El campo Número de identificación es obligatorio.');
    if (!String(draft.gradoAspira ?? value.gradoAspira).trim()) errs.push('El campo Grado al que aspira es obligatorio.');

    return errs;
  }, [draft, value]);

  // ---- Sync externo (si cambian props.value, actualiza draft) ----
  useEffect(() => {
    setDraft(d => ({
      ...d,
      anio: value.anio,
      estado: value.estado,
      gradoAnterior: safe(value.gradoAnterior, ''),
      gradoAspira: value.gradoAspira,
      estudiante: { ...value.estudiante },
      verificacion: { ...value.verificacion },
      padre: value.padre ? { ...value.padre } : d.padre,
      madre: value.madre ? { ...value.madre } : d.madre,
      responsable: value.responsable ? { ...value.responsable } : d.responsable,
    }));
  }, [value]);

  // ---- Handlers ----
  const setField = <K extends keyof Draft>(key: K, val: Draft[K]) => {
    setDraft(prev => {
      const next = { ...prev, [key]: val };
      onChange?.(next);
      return next;
    });
  };

  const setNested = (root: 'estudiante' | 'verificacion' | 'padre' | 'madre' | 'responsable', key: string, val: any) => {
    setDraft(prev => {
      const next = { ...prev, [root]: { ...(prev as any)[root], [key]: val } } as Draft;
      onChange?.(next);
      return next;
    });
  };

  const submit = async () => {
    setConfirmOpen(false);
    if (!isDirty || errors.length) return;
    setSaving(true);
    try {
      await onSave(diffPayload);
      setToast({ type: 'is-success', msg: 'Cambios guardados correctamente.' });
    } catch (e: any) {
      setToast({ type: 'is-danger', msg: e?.message ?? 'No se pudo guardar.' });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 2200);
    }
  };

  const openConfirm = () => setConfirmOpen(true);
  const cancelConfirm = () => setConfirmOpen(false);

  // ---- Render ----
  return (
    <div>
      {toast && <div className={`notification ${toast.type}`} role="status">{toast.msg}</div>}

      {/* INFO CABECERA */}
      <section className='section users-scope'>

        <div className="box">
          <div className="columns">
            <div className="column is-one-quarter">
              <label className="label" htmlFor="mf-anio">Año</label>
              <div className="control">
                <input id="mf-anio" className="input" type="number"
                  value={draft.anio ?? value.anio}
                  onChange={e => setField('anio', Number(e.target.value))}
                />
              </div>
            </div>
            <div className="column is-one-quarter">
              <label className="label" htmlFor="mf-estado">Estado</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select id="mf-estado"
                    value={draft.estado ?? value.estado}
                    onChange={e => setField('estado', e.target.value as Matricula['estado'])}
                  >
                    {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="column is-one-quarter">
              <label className="label" htmlFor="mf-grado-aspira">Grado al que aspira</label>
              <div className="control">
                <input id="mf-grado-aspira" className="input" type="text"
                  value={draft.gradoAspira ?? value.gradoAspira}
                  onChange={e => setField('gradoAspira', e.target.value)}
                />
              </div>
            </div>
            <div className="column is-one-quarter">
              <label className="label" htmlFor="mf-grado-anterior">Grado anterior</label>
              <div className="control">
                <input id="mf-grado-anterior" className="input" type="text"
                  value={draft.gradoAnterior ?? value.gradoAnterior ?? ''}
                  onChange={e => setField('gradoAnterior', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* DATOS ESTUDIANTE */}
        <div className="box">
          <h3 className="title is-5">Datos del estudiante</h3>
          <div className="columns is-multiline">
            {FIELDSET.estudiante.map(f => (
              <div key={f.key} className="column is-one-third">
                <label className="label" htmlFor={`mf-est-${f.key}`}>{f.label}</label>
                <div className="control">
                  <input
                    id={`mf-est-${f.key}`}
                    className="input"
                    type={f.type}
                    value={(draft.estudiante as any)?.[f.key] ?? (value.estudiante as any)?.[f.key] ?? ''}
                    onChange={e => setNested('estudiante', f.key, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VERIFICACIÓN */}
        <div className="box">
          <h3 className="title is-5">Verificación de identidad del estudiante</h3>
          <div className="columns">
            <div className="column is-one-quarter">
              <label className="label" htmlFor="mf-tipoid">Tipo de identificación</label>
              <div className="control">
                <input id="mf-tipoid" className="input" value={draft.verificacion?.tipoId ?? value.verificacion?.tipoId ?? ''} onChange={e => setNested('verificacion', 'tipoId', e.target.value)} />
              </div>
            </div>
            <div className="column is-one-quarter">
              <label className="label" htmlFor="mf-numid">Número de identificación</label>
              <div className="control">
                <input id="mf-numid" className="input" value={draft.verificacion?.numeroId ?? value.verificacion?.numeroId ?? ''} onChange={e => setNested('verificacion', 'numeroId', e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* PADRE / MADRE */}
        <div className="box">
          <h3 className="title is-5">Acudientes</h3>
          <div className="columns">
            {FIELDSET.acudiente.map(g => (
              <div key={g.group} className="column">
                <h4 className="subtitle is-6">{g.title}</h4>
                <div className="columns is-multiline">
                  {['nombres','apellidos','numeroIdentificacion','email','telefono','direccion','empresa','cargo','ciudad'].map(k => (
                    <div key={k} className="column is-half">
                      <label className="label" htmlFor={`mf-${g.group}-${k}`}>{labelize(k)}</label>
                      <div className="control">
                        <input
                          id={`mf-${g.group}-${k}`}
                          className="input"
                          type={k === 'email' ? 'email' : k === 'telefono' ? 'tel' : 'text'}
                          value={(draft as any)[g.group]?.[k] ?? (value as any)[g.group]?.[k] ?? ''}
                          onChange={e => setNested(g.group as any, k, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RESPONSABLE */}
        <div className="box">
          <h3 className="title is-5">Responsable económico</h3>
          <div className="columns">
            <div className="column is-half">
              <label className="label" htmlFor="mf-quien-asume">¿Quién asume los costos?</label>
              <div className="control">
                <input id="mf-quien-asume" className="input"
                  value={draft.responsable?.quienAsumeCostos ?? (value.responsable as any)?.quienAsumeCostos ?? ''}
                  onChange={e => setNested('responsable', 'quienAsumeCostos', e.target.value)}
                />
              </div>
            </div>
            <div className="column is-half">
              <label className="checkbox" htmlFor="mf-10dias">
                <input
                  id="mf-10dias"
                  type="checkbox"
                  checked={!!(draft.responsable?.seComprometePrimeros10Dias ?? (value.responsable as any)?.seComprometePrimeros10Dias)}
                  onChange={e => setNested('responsable', 'seComprometePrimeros10Dias', e.target.checked)}
                  style={{ marginRight: 8 }}
                />
                Se compromete a cumplir pagos en los primeros 10 días
              </label>
            </div>
          </div>
        </div>

        {/* Acciones */}
        {errors.length > 0 && (
          <article className="message is-warning">
            <div className="message-body">
              <ul style={{ marginLeft: '1rem' }}>
                {errors.map((er, i) => <li key={i}>• {er}</li>)}
              </ul>
            </div>
          </article>
        )}

        <div className="buttons">
          <button
            className="button is-primary"
            onClick={openConfirm}
            disabled={!isDirty || errors.length > 0 || saving}
            aria-label="Guardar cambios"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
          <button
            className="button"
            onClick={() => setDraft({
              anio: value.anio,
              estado: value.estado,
              gradoAnterior: safe(value.gradoAnterior, ''),
              gradoAspira: value.gradoAspira,
              estudiante: { ...value.estudiante },
              verificacion: { ...value.verificacion },
              padre: value.padre ? { ...value.padre } : { nombres: '', apellidos: '', numeroIdentificacion: '', email: '', telefono: '', direccion: '', empresa: '', cargo: '', ciudad: '' },
              madre: value.madre ? { ...value.madre } : { nombres: '', apellidos: '', numeroIdentificacion: '', email: '', telefono: '', direccion: '', empresa: '', cargo: '', ciudad: '' },
              responsable: value.responsable ? { ...value.responsable } : { quienAsumeCostos: '', seComprometePrimeros10Dias: false },
            })}
            disabled={saving}
            aria-label="Revertir cambios"
          >
            Revertir cambios
          </button>
        </div>
      </section>

      {/* Modal confirmación */}
      <ConfirmModal
        open={confirmOpen}
        title="Confirmar guardado"
        message="Estás a punto de aplicar cambios sensibles en la matrícula. ¿Deseas continuar?"
        confirmLabel="Sí, guardar"
        cancelLabel="Cancelar"
        onConfirm={submit}
        onCancel={cancelConfirm}
      />
    </div>
  );
}

function labelize(k: string) {
  switch (k) {
    case 'numeroIdentificacion': return 'Número de identificación';
    case 'quienAsumeCostos': return 'Quién asume los costos';
    case 'seComprometePrimeros10Dias': return 'Se compromete primeros 10 días';
    default:
      // capitaliza simple
      return k.charAt(0).toUpperCase() + k.slice(1);
  }
}
