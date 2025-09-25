import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilters, setFilterYear /*, setFilterYearExclusive */ } from '@/features/admisiones/store/slice';
import { selectFilters, selectStats, selectYearsAvailable } from '@/features/admisiones/store/selectors';

export default function FilterBar() {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const stats = useSelector(selectStats);
  const years = useSelector(selectYearsAvailable);

  const onYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    const year = v === '' ? null : Number(v);
    // Si quieres que sea exclusivo (limpie dateFrom/dateTo), usa setFilterYearExclusive
    dispatch(setFilterYear(year));
  };

  return (
    <div className="box">
      <div className="field is-grouped is-grouped-multiline">
        {/* Texto */}
        <div className="control is-expanded">
          <input
            className="input"
            placeholder="Buscar por nombre, apellidos o identificación…"
            value={filters.q}
            onChange={(e) => dispatch(setFilter({ key: 'q', value: e.target.value }))}
          />
        </div>

        {/* Estado */}
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

        {/* Tag */}
        <div className="control">
          <input
            className="input"
            placeholder="Tag"
            value={filters.tag ?? ''}
            onChange={(e) => dispatch(setFilter({ key: 'tag', value: e.target.value || null }))}
          />
        </div>

        {/* Autorizado */}
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

        {/* Orden */}
        <div className="control">
          <div className="select">
            <select
              value={filters.orden}
              onChange={(e) => dispatch(setFilter({ key: 'orden', value: e.target.value as any }))}
            >
              <option value="createdAt_desc">Recientes primero</option>
              <option value="createdAt_asc">Antiguos primero</option>
            </select>
          </div>
        </div>

        {/* Año (NUEVO) */}
        <div className="control">
          <div className="select">
            <select value={filters.year ?? ''} onChange={onYearChange} aria-label="Filtrar por año">
              <option value="">Año (todos)</option>
              {/* Incluye el año actual aunque no esté en datos */}
              {(() => {
                const current = new Date().getFullYear();
                const merged = Array.from(new Set([current, ...years])).sort((a, b) => b - a);
                return merged.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ));
              })()}
            </select>
          </div>
        </div>

        {/* Limpiar */}
        <div className="control">
          <button className="button" onClick={() => dispatch(clearFilters())}>
            Limpiar
          </button>
        </div>

        {/* KPIs rápidos */}
        <div className="control">
          <span className="tag is-link">Total: {stats.total}</span>
        </div>
      </div>
    </div>
  );
}
