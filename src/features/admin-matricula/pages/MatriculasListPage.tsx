import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '@/app/store';
import MatriculasTable from '../components/MatriculasTable';
import '@/features/admin-matricula/styles/adminMatricula.light.css'

import { setFilters } from '../store/slice';
import { fetchMatriculas } from '../store';
import {
  selectMatriculas,          // <- ahora ya filtradas en cliente
  selectMatriculasLoading,
  selectFilters,
} from '../store';

const currentYear = () => new Date().getFullYear();

export default function MatriculasListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectMatriculas);
  const loading = useSelector(selectMatriculasLoading);
  const filters = useSelector(selectFilters);
  const error = useSelector((s: any) => s.adminMatricula?.list?.error as string | null);
  const navigate = useNavigate();
  

  // Primera carga por año
  useEffect(() => {
    dispatch(fetchMatriculas(undefined));
  }, [dispatch]);

  const onApply = () => dispatch(fetchMatriculas(undefined));
  const onClear = () => {
    dispatch(setFilters({ anio: currentYear(), grado: null, estado: null, q: '' }));
    dispatch(fetchMatriculas(undefined));
  };

  return (
    <div className="section users-scope">
      <h1 className="title">Matrículas</h1>
      <p className="subtitle">Registro de estudiantes matriculados</p>

      <div className="box" role="search">
        <div className="columns is-multiline">
          <div className="column is-one-quarter">
            <label className="label" htmlFor="filtro-anio">Año</label>
            <div className="control">
              <input
                id="filtro-anio"
                className="input"
                type="number"
                value={filters.anio}
                onChange={e => dispatch(setFilters({ anio: Number(e.target.value || currentYear()) }))}
                aria-label="Filtro por año"
              />
            </div>
          </div>

          <div className="column is-one-quarter">
            <label className="label" htmlFor="filtro-grado">Grado</label>
            <div className="control">
              <input
                id="filtro-grado"
                className="input"
                placeholder="Ej. 1, 5°, 10"
                value={filters.grado ?? ''}
                onChange={e => dispatch(setFilters({ grado: e.target.value.trim() || null }))}
                aria-label="Filtro por grado"
              />
            </div>
          </div>

          <div className="column is-one-quarter">
            <label className="label" htmlFor="filtro-estado">Estado</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  id="filtro-estado"
                  value={filters.estado ?? ''}
                  onChange={e => dispatch(setFilters({ estado: (e.target.value || null) as any }))}
                  aria-label="Filtro por estado"
                >
                  <option value="">Todos</option>
                  <option value="en_revision">en_revision</option>
                  <option value="matriculado">matriculado</option>
                  <option value="pendiente">pendiente</option>
                  <option value="rechazado">rechazado</option>
                  <option value="retirado">retirado</option>
                  <option value="revocado">revocado</option>
                </select>
              </div>
            </div>
          </div>

          <div className="column is-one-quarter">
            <label className="label" htmlFor="filtro-buscar">Buscar</label>
            <div className="control">
              <input
                id="filtro-buscar"
                className="input"
                placeholder="Nombre o documento"
                value={filters.q}
                onChange={e => {/* podrías setFilters({ q: e.target.value }) si quieres */}}
                aria-label="Buscar"
              />
            </div>
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button className="button is-primary" onClick={onApply} aria-label="Aplicar filtros">
              Aplicar
            </button>
          </div>
          <div className="control">
            <button className="button" onClick={onClear} aria-label="Limpiar filtros">
              Limpiar
            </button>
          </div>
        </div>

        {error && <div className="notification is-danger" role="alert">{error}</div>}
      </div>

      {loading && <progress className="progress is-primary" max={100} />}
      
      <MatriculasTable items={items}/>


      <div className="field has-addons" style={{ justifyContent: 'flex-end' }}>
        <div className="control">
          <button className="button" onClick={() => dispatch(fetchMatriculas(undefined))}>
            Cargar más
          </button>
        </div>
        <div className="control">
          <a className="button is-link" href="/admin/matriculas/export">
            Exportar
          </a>
        </div>
      </div>
    </div>
  );
}
