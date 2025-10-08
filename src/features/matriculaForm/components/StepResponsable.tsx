import type { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateForm } from '../store/slice';
import { selectForm } from '../store/selector';

const StepResponsable: FC = () => {
  const dispatch = useDispatch<any>();
  const form = useSelector(selectForm);
  const set = (patch: any) => (dispatch as any)(updateForm({ responsable: { ...form.responsable, ...patch }}));

  return (
    <>
      <div className="field">
        <label className="label">¿Quién asume los costos?</label>
        <div className="select is-fullwidth">
          <select required value={form.responsable.quienAsumeCostos ?? ''} onChange={e=>set({ quienAsumeCostos: e.target.value })}>
            <option value="" disabled>Seleccione</option>
            <option key={form.padre.nombres} value={`${form.padre.nombres} ${form.padre.apellidos}`}>{`${form.padre.nombres} ${form.padre.apellidos}`}</option>
            <option key={form.madre.nombres} value={`${form.madre.nombres} ${form.madre.apellidos}`}>{`${form.madre.nombres} ${form.madre.apellidos}`}</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label className="checkbox">
          <input type="checkbox" required className="mr-2" checked={!!form.responsable.seComprometePrimeros10Dias} onChange={e=>set({ seComprometePrimeros10Dias: e.target.checked })}/>
          Me comprometo a realizar el pago en los primeros 10 días de cada mes.
        </label>
      </div>
    </>
  );
};

export default StepResponsable;
