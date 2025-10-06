import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store';
import { exportMatriculasXls } from '../store';

export default function MatriculasExportPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [grado, setGrado] = useState<string>('');
  const [estado, setEstado] = useState<string>('');

  const onExport = async () => {
    const res = await dispatch(
      exportMatriculasXls({ anio, grado: grado || null, estado: (estado || null) as any })
    ).unwrap();
    const a = document.createElement('a');
    a.href = res.url;
    a.download = res.filename;
    a.click();
  };

  return (
    <div className="section">
      <h1 className="title">Exportar Matrículas</h1>
      <div className="columns">
        <div className="column is-one-quarter">
          <label className="label" htmlFor="exp-anio">Año</label>
          <input
            id="exp-anio"
            className="input"
            type="number"
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
            aria-label="Año a exportar"
          />
        </div>
        <div className="column is-one-quarter">
          <label className="label" htmlFor="exp-grado">Grado</label>
          <input
            id="exp-grado"
            className="input"
            value={grado}
            onChange={(e) => setGrado(e.target.value)}
            aria-label="Grado a exportar"
          />
        </div>
        <div className="column is-one-quarter">
          <label className="label" htmlFor="exp-estado">Estado</label>
          <div className="select is-fullwidth">
            <select
              id="exp-estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              aria-label="Estado a exportar"
            >
              <option value="">Todos</option>
              <option value="matriculado">matriculado</option>
              <option value="en_revision">en_revision</option>
              <option value="pendiente">pendiente</option>
              <option value="rechazado">rechazado</option>
              <option value="retirado">retirado</option>
              <option value="revocado">revocado</option>
            </select>
          </div>
        </div>
        <div className="column is-one-quarter">
          <label className="label" aria-hidden="true">
            &nbsp;
          </label>
          <button className="button is-link is-fullwidth" onClick={onExport} aria-label="Exportar XLS">
            Exportar XLS
          </button>
        </div>
      </div>
    </div>
  );
}
