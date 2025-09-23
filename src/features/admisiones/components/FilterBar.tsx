import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilters } from '@/features/admisiones/store/slice';
import { selectFilters, selectStats } from '@/features/admisiones/store/selectors';

export default function FiltersBar() {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const stats = useSelector(selectStats);

  return (
    <div className="box">
      <div className="field is-grouped is-grouped-multiline">
        <div className="control is-expanded">
          <input
            className="input"
            placeholder="Buscar por nombre, apellidos o identificación…"
            value={filters.q}
            onChange={(e) => dispatch(setFilter({ key: 'q', value: e.target.value }))}
          />
        </div>

        <div className="control">
          <div className="select">
            <select
              value={filters.estado ?? ''}
              onChange={(e) => dispatch(setFilter({ key: 'estado', value: e.target.value || null }))}
            >
              <option value="">Estado (todos)</option>
              <option value="en_espera">En espera</option>
              <option value="en_revision">En revisión</option>
              <option value="admitido">Admitido</option>
              <option value="no_admitido">No admitido</option>
            </select>
          </div>
        </div>

        <div className="control">
          <input
            className="input"
            placeholder="Tag"
            value={filters.tag ?? ''}
            onChange={(e) => dispatch(setFilter({ key: 'tag', value: e.target.value || null }))}
          />
        </div>

        <div className="control">
          <div className="select">
            <select
              value={filters.autorizado === null ? '' : String(filters.autorizado)}
              onChange={(e) =>
                dispatch(
                  setFilter({
                    key: 'autorizado',
                    value: e.target.value === '' ? null : e.target.value === 'true',
                  }),
                )
              }
            >
              <option value="">Autorizado</option>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        <div className="control">
          <div className="select">
            <select
              value={filters.orden}
              onChange={(e) => dispatch(setFilter({ key: 'orden', value: e.target.value }))}
            >
              <option value="createdAt_desc">Recientes primero</option>
              <option value="createdAt_asc">Antiguos primero</option>
            </select>
          </div>
        </div>

        <div className="control">
          <button className="button" onClick={() => dispatch(clearFilters())}>Limpiar</button>
        </div>

        <div className="control">
          <span className="tag is-info">Total: {stats.total}</span>
        </div>
      </div>
    </div>
  );
}
