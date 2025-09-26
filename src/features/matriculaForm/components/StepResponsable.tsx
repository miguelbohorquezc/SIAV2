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
        <div className="control">
          <input className="input" placeholder='Especifique nombres y apellidos' required value={form.responsable.quienAsumeCostos ?? ''} onChange={e=>set({ quienAsumeCostos: e.target.value })}/>

        </div>
      </div>
      <div className="field">
        <label className="checkbox">
          <input type="checkbox" className="mr-2" checked={!!form.responsable.seComprometePrimeros10Dias} onChange={e=>set({ seComprometePrimeros10Dias: e.target.checked })}/>
          Me comprometo a realizar el pago en los primeros 10 días de cada mes.
        </label>
      </div>
    </>
  );
};

export default StepResponsable;
