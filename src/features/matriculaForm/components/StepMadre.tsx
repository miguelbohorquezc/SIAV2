import { useDispatch, useSelector } from 'react-redux';
import { updateForm } from '../store/slice';
import { selectForm } from '../store/selector';

export default function StepMadre({ showErrors }: { showErrors: boolean }) {
  const dispatch = useDispatch<any>();
  const form = useSelector(selectForm);
  const set = (patch: any) => (dispatch as any)(updateForm({ madre: { ...form.madre, ...patch }}));

   const invalid = {
    nombres: showErrors && !form.madre.nombres,
    apellidos: showErrors && !form.madre.apellidos,
    numeroIdentificacion: showErrors && !/^\d{4,}$/.test(form.madre.numeroIdentificacion || ''),
    telefono: showErrors && !/^\d{7,10}$/.test(form.madre.telefono || ''),
    email: showErrors && !form.madre.email,
    ciudad: showErrors && !form.madre.ciudad,
    empresa: showErrors && !form.madre.empresa,
    profesion: showErrors && !form.madre.cargo,
  };

  return (
    <>
      <h1 className="title is-4 has-text-dark">Datos de la madre</h1>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Nombres</label>
            <div className="control"><input className="input" placeholder='Nombres' required value={form.madre.nombres ?? ''} onChange={e=>set({ nombres: e.target.value })}/></div>
          </div>
          {invalid.nombres && <p className="help is-danger">Campo obligatorio.</p>}
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Apellidos</label>
            <div className="control"><input className="input" placeholder='Apellidos' required value={form.madre.apellidos ?? ''} onChange={e=>set({ apellidos: e.target.value })}/></div>
          </div>
          {invalid.apellidos && <p className="help is-danger">Campo obligatorio.</p>}
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Número de identificación</label>
            <div className="control"><input className="input"  placeholder='Número de identificación' required pattern="^\d{4,}$" value={form.madre.numeroIdentificacion ?? ''} onChange={e=>set({ numeroIdentificacion: e.target.value })}/></div>
          </div>
          {invalid.numeroIdentificacion && <p className="help is-danger">Campo obligatorio.</p>}
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Teléfono</label>
            <div className="control"><input className="input"  placeholder='Teléfono' required pattern="^\d{7,10}$" value={form.madre.telefono ?? ''} onChange={e=>set({ telefono: e.target.value })}/></div>
            <p className="help">7–10 dígitos</p>
          </div>
          {invalid.telefono && <p className="help is-danger">Campo obligatorio.</p>}
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Email</label>
            <div className="control"><input className="input" required placeholder='Email' type="email" value={form.madre.email ?? ''} onChange={e=>set({ email: e.target.value })}/></div>
          </div>
          {invalid.email && <p className="help is-danger">Campo obligatorio.</p>}
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Ciudad</label>
            <div className="control"><input className="input" required placeholder='Ciudad' type="text" value={form.madre.ciudad ?? ''} onChange={e=>set({ ciudad: e.target.value })}/></div>
          </div>
          {invalid.ciudad && <p className="help is-danger">Campo obligatorio.</p>}
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Empresa</label>
            <div className="control"><input className="input" required placeholder='Empresa donde trabaja' value={form.madre.empresa ?? ''} onChange={e=>set({ empresa: e.target.value })}/></div>
          </div>
          {invalid.empresa && <p className="help is-danger">Campo obligatorio.</p>}
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Profesión / Cargo</label>
            <div className="control"><input className="input" required placeholder='Profesión / Cargo' value={form.madre.cargo ?? ''} onChange={e=>set({ profesion: e.target.value })}/></div>
          </div>
          {invalid.profesion && <p className="help is-danger">Campo obligatorio.</p>}
        </div>
      </div>
    </>
  );
};
