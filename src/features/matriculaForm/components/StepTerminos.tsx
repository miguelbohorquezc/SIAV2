import type { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateForm } from '../store/slice';
import { selectForm, selectAnio } from '../store/selector';

const StepTerminos: FC = () => {
  const dispatch = useDispatch<any>();
  const form = useSelector(selectForm);
  const anio = useSelector(selectAnio);
  const set = (patch: any) => (dispatch as any)(updateForm({ terms: { ...form.terms, ...patch }}));

  return (
    <>
      <article className="message is-info">
        <div className="message-header has-background-info">
          <p>Términos y condiciones</p>
        </div>
        <div className="message-body has-background-info-light has-text-dark">
          Declaro que la información suministrada es veraz. Al presionar Siguiente Autorizo el tratamiento de datos conforme a la política de tratamiento de datos institucional.
        </div>
      </article>
      <label className="checkbox">
        <input type="checkbox" className="mr-2" checked={!!form.terms.acepta} onChange={e=>set({ acepta: e.target.checked })} required/>
        Acepto los términos y condiciones.
      </label>
    </>
  );
};

export default StepTerminos;
