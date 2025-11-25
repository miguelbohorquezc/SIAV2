
import { useDispatch, useSelector } from 'react-redux';
import { updateForm } from '../store/slice';
import { selectForm } from '../store/selector';

export default function StepPadre({ showErrors }: { showErrors: boolean }) {
  const dispatch = useDispatch<any>();
  const form = useSelector(selectForm);
  const set = (patch: any) => (dispatch as any)(updateForm({ padre: { ...form.padre, ...patch }}));

  const invalid = {
    nombres: showErrors && !form.padre.nombres,
    apellidos: showErrors && !form.padre.apellidos,
    numeroIdentificacion: showErrors && !/^\d{4,}$/.test(form.padre.numeroIdentificacion || ''),
    telefono: showErrors && !/^\d{7,10}$/.test(form.padre.telefono || ''),
    email: showErrors && !form.padre.email,
    ciudad: showErrors && !form.padre.ciudad,
    empresa: showErrors && !form.padre.empresa,
    profesion: showErrors && !form.padre.cargo,
  };

  return (
    <>
      <h1 className="title is-4 has-text-dark">Datos del padre</h1>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Nombres</label>
            <div className="control"><input className="input" placeholder='Nombres' required value={form.padre.nombres ?? ''} onChange={e=>set({ nombres: e.target.value })}/></div>
          </div>
          {invalid.nombres && <p className="help is-danger">Campo obligatorio.</p>}
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Apellidos</label>
            <div className="control"><input className="input" placeholder='Apellidos' required value={form.padre.apellidos ?? ''} onChange={e=>set({ apellidos: e.target.value })}/></div>
          </div>
          {invalid.apellidos && <p className="help is-danger">Campo obligatorio.</p>}
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Número de identificación</label>
            <div className="control"><input className="input" placeholder='Número de identificación' required pattern="^\\d{4,}$" value={form.padre.numeroIdentificacion ?? ''} onChange={e=>set({ numeroIdentificacion: e.target.value })}/></div>
          </div>
          {invalid.numeroIdentificacion && <p className="help is-danger">Campo obligatorio.</p>}
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Teléfono</label>
            <div className="control"><input className="input" placeholder='Teléfono' required pattern="^\\d{7,10}$" value={form.padre.telefono ?? ''} onChange={e=>set({ telefono: e.target.value })}/></div>
            <p className="help">7–10 dígitos</p>
          </div>
          {invalid.telefono && <p className="help is-danger">Campo obligatorio.</p>}
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Email</label>
            <div className="control"><input className="input" placeholder='Email' required type="email" value={form.padre.email ?? ''} onChange={e=>set({ email: e.target.value })}/></div>
          </div>
          {invalid.email && <p className="help is-danger">Campo obligatorio.</p>}
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Ciudad</label>
            <div className="control"><input className="input" placeholder='Ciudad' required type="text" value={form.padre.ciudad ?? ''} onChange={e=>set({ ciudad: e.target.value })}/></div>
          </div>
          {invalid.ciudad && <p className="help is-danger">Campo obligatorio.</p>}
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Empresa</label>
            <div className="control"><input className="input" placeholder='Empresa donde trabaja' value={form.padre.empresa ?? ''} onChange={e=>set({ empresa: e.target.value })}/></div>
          </div>
          {invalid.empresa && <p className="help is-danger">Campo obligatorio.</p>}
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Profesión / Cargo</label>
            <div className="control"><input className="input" placeholder='Profesión / Cargo' value={form.padre.cargo ?? ''} onChange={e=>set({ profesion: e.target.value })}/></div>
          </div>
          {invalid.profesion && <p className="help is-danger">Campo obligatorio.</p>}
        </div>
      </div>
    </>
  );
};

