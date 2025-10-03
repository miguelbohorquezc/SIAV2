import type { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GRADOS_OPCIONES } from '../constants';
import { updateForm } from '../store/slice';
import { selectForm } from '../store/selector';

const StepEstudiante: FC = () => {
  const dispatch = useDispatch<any>();
  const form = useSelector(selectForm);
  const set = (patch: any) => (dispatch as any)(updateForm({ estudiante: { ...form.estudiante, ...patch }}));

  return (
    <>
      <div className="field">
        <label className="label">Grado al que aspira</label>
        <div className="control">
          <div className="select is-fullwidth">
            <select value={form.estudiante.gradoAspira ?? ''} onChange={e=>set({ gradoAspira: e.target.value })} required>
              <option value="" disabled>Seleccione</option>
              {GRADOS_OPCIONES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Nombres</label>
            <div className="control"><input className="input" placeholder='Nombres' required pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$"
              value={form.estudiante.nombres ?? ''} onChange={e=>set({ nombres: e.target.value })}/></div>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Apellidos</label>
            <div className="control"><input className="input" placeholder='Apellidos' required pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$"
              value={form.estudiante.apellidos ?? ''} onChange={e=>set({ apellidos: e.target.value })}/></div>
          </div>
        </div>
      </div>
      <div className="field">
        <label className="label">Fecha de nacimiento</label>
        <div className="control"><input className="input" placeholder='Nombres' type="date" required
          value={form.estudiante.fechaNacimiento ?? ''} onChange={e=>set({ fechaNacimiento: e.target.value })}/></div>
      </div>
    </>
  );
};

export default StepEstudiante;
