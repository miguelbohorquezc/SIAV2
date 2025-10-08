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
      <div className='columns'>
        <div className="column">
          <label className="label">Fecha de nacimiento</label>
          <div className="control"><input className="input" placeholder='Nombres' type="date" required
            value={form.estudiante.fechaNacimiento ?? ''} onChange={e=>set({ fechaNacimiento: e.target.value })}/></div>
        </div>
        <div className="column">
            <label className="label">Sexo</label>
            <div className="control">
              <div className='select'>
                <select value={form.estudiante.sexo ?? ''} onChange={e=>set({ sexo: e.target.value })} required>
                    <option value="" disabled>Seleccione</option>
                    <option key={'F'} value={'F'}>{'F'}</option>
                    <option key={'M'} value={'M'}>{'M'}</option>
                </select>
              </div>
            </div>
        </div>
        <div className="column">
              <label className="label">Edad Años</label>
              <div className="field">
                <div className="control">
                  <input className="input" placeholder='Edad' type='number' required
                  value={form.estudiante.edadAnios ?? ''} onChange={e=>set({ edadAnios: e.target.value })}/>
                </div>
              </div>
        </div>
        <div className="column is-one-third">
              <label className="label">Edad Meses</label>
              <div className="control"><input className="input" placeholder='Edad' type='number' required
                value={form.estudiante.edadMeses ?? ''} onChange={e=>set({ edadMeses: e.target.value })}/>
              </div>
        </div>
      </div>
      <div className='columns'>
        <div className="column">
          <div className="field">
            <label className="label">Teléfono</label>
            <div className="control"><input className="input" placeholder='Opcional' pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$"
              value={form.estudiante.telefono ?? ''} onChange={e=>set({ telefono: e.target.value })}/></div>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Religión</label>
            <div className="control"><input className="input" placeholder='Religión' required pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$"
              value={form.estudiante.religion ?? ''} onChange={e=>set({ religion: e.target.value })}/></div>
          </div>
        </div>
      </div>
      <div className='columns'>
        <div className="column">
              <label className="label">Colegio anterior</label>
              <div className="field">
                <div className="control">
                  <input className="input" placeholder='Edad' type='text' required
                  value={form.estudiante.colegioAnterior ?? ''} onChange={e=>set({ colegioAnterior: e.target.value })}/>
                </div>
              </div>
        </div>
        <div className="column">
              <label className="label">Último grado cursado</label>
              <div className="field">
                <div className="control">
                  <input className="input" placeholder='Edad' type='text' required
                  value={form.estudiante.ultimoGrado ?? ''} onChange={e=>set({ ultimoGrado: e.target.value })}/>
                </div>
              </div>
        </div>   
      </div>
    </>
  );
};

export default StepEstudiante;
