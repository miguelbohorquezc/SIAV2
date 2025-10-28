import type { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateForm } from '../store/slice';
import { selectForm, selectAnio } from '../store/selector';

const StepTerminos: FC = () => {
  const dispatch = useDispatch<any>();
  const form = useSelector(selectForm);
  //@ts-ignore
  const anio = useSelector(selectAnio);
  const set = (patch: any) => (dispatch as any)(updateForm({ terms: { ...form.terms, ...patch }}));

  return (
    <>
      <article className="message is-info">
        <div className="message-header has-background-danger">
          <p>Declaración y Autorización de Tratamiento de Datos Personales</p>
        </div>
        <div className="message-body has-background-danger-light has-text-dark">
          <strong>Declaración y Autorización de Tratamiento de Datos Personales </strong>
          <br/>
          Declaro que la información suministrada es veraz y corresponde a la realidad.
          Al presionar “Siguiente”, autorizo de manera libre, expresa e informada a la institución educativa para que realice el tratamiento de mis datos personales, conforme a lo establecido en la Ley 1581 de 2012, el Decreto 1377 de 2013, y la Política Institucional de Tratamiento de Datos Personales, la cual regula la recolección, almacenamiento, uso, circulación y supresión de la información.

          El tratamiento de los datos tendrá como finalidad <strong>la gestión administrativa, académica y comunicativa</strong> relacionada con los procesos institucionales.
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
