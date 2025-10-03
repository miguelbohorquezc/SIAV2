import type { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateForm } from '../store/slice';
import { selectForm } from '../store/selector';

const StepMadre: FC = () => {
  const dispatch = useDispatch<any>();
  const form = useSelector(selectForm);
  const set = (patch: any) => (dispatch as any)(updateForm({ madre: { ...form.madre, ...patch }}));

  return (
    <>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Nombres</label>
            <div className="control"><input className="input" placeholder='Nombres' required value={form.madre.nombres ?? ''} onChange={e=>set({ nombres: e.target.value })}/></div>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Apellidos</label>
            <div className="control"><input className="input" placeholder='Apellidos' required value={form.madre.apellidos ?? ''} onChange={e=>set({ apellidos: e.target.value })}/></div>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Número de identificación</label>
            <div className="control"><input className="input" placeholder='Número de identificación' required pattern="^\d{4,}$" value={form.madre.numeroIdentificacion ?? ''} onChange={e=>set({ numeroIdentificacion: e.target.value })}/></div>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Teléfono</label>
            <div className="control"><input className="input" placeholder='Teléfono' required pattern="^\d{7,10}$" value={form.madre.telefono ?? ''} onChange={e=>set({ telefono: e.target.value })}/></div>
            <p className="help">7–10 dígitos</p>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Email</label>
            <div className="control"><input className="input" placeholder='Email' type="email" value={form.madre.email ?? ''} onChange={e=>set({ email: e.target.value })}/></div>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Empresa</label>
            <div className="control"><input className="input" placeholder='Empresa donde trabaja' value={form.madre.empresa ?? ''} onChange={e=>set({ empresa: e.target.value })}/></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StepMadre;
