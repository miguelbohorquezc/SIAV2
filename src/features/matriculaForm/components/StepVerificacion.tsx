import type { FC, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setError, updateVerificacion } from '../store/slice';
import { selectAnio, selectDuplicate, selectError, selectForm, selectStatus } from '../store/selector';
import { preloadIfExistsThunk, verifyIdentificationThunk } from '../store/thunks';

const tipos = ['RC','TI','PA'] as const;

const StepVerificacion: FC<{ onVerified: () => void }> = ({ onVerified }) => {
  const dispatch = useDispatch<any>();
  const form = useSelector(selectForm);
  const anio = useSelector(selectAnio);
  const duplicate = useSelector(selectDuplicate);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);

  function normalizeNum(s: string) { return s.replace(/[^\d]/g,''); }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    (dispatch as any)(setError(null));

    const tipoId = (form.verificacion.tipoId as any) || 'RC';
    const numeroId = normalizeNum(form.verificacion.numeroId || '');
    if (!numeroId) {
      (dispatch as any)(setError('Ingrese un número de identificación válido.'));
      return;
    }

    // 1) Duplicado año actual (en /matriculas)
    const verifyRes = await dispatch(verifyIdentificationThunk({ tipoId, numeroId, anio: anio! })).unwrap();
    if (verifyRes.duplicate || duplicate) {
      (dispatch as any)(setError('Ya existe una matrícula para este año con esta identificación.'));
      return;
    }

    // 2) Buscar en /applicants y chequear autorización
    const preload = await dispatch(preloadIfExistsThunk({ tipoId, numeroId })).unwrap();
    if (!preload) {
      (dispatch as any)(setError('No se encontró información relacionada con ese número de identificación.'));
      return;
    }
    if (!preload.autorizado) {
      (dispatch as any)(setError('Esta identificación no está autorizada para el proceso de matrícula. Por favor, comuníquese con la Secretaría. Tenga en cuenta que la matrícula solo se habilita después de haber efectuado el pago de la matrícula y entregar la documentación requerida.'));
      return;
    }

    onVerified();
  };

  return (
    <form onSubmit={submit}>
      <div className="field">
        <label className="label">Tipo de identificación</label>
        <div className="control">
          <div className="select is-fullwidth">
            <select
              value={form.verificacion.tipoId ?? ''}
              onChange={e => (dispatch as any)(updateVerificacion({ tipoId: e.target.value as any }))}
              required
            >
              <option value="" disabled>Seleccione</option>
              {tipos.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Número de identificación</label>
        <div className="control">
          <input
            className="input"
            placeholder="Solo dígitos"
            value={form.verificacion.numeroId ?? ''}
            onChange={e => (dispatch as any)(updateVerificacion({ numeroId: e.target.value }))}
            required
            type='number'
          />
        </div>
        <p className="help">Sin puntos ni guiones</p>
      </div>

      {error && <p className="has-text-danger" role="alert">{error}</p>}

      <div className="field mt-5">
        <div className="control">
          <button className={`button is-primary ${status==='loading'?'is-loading':''}`} type="submit">
            Verificar
          </button>
        </div>
      </div>
    </form>
  );
};

export default StepVerificacion;
