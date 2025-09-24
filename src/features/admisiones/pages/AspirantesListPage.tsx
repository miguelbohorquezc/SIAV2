import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import FiltersBar from '@/features/admisiones/components/FilterBar';
import EstadoBadge from '@/features/admisiones/components/EstadoBadge';
import { fetchApplicantsPage, exportCsv } from '@/features/admisiones/store/thunks';
import { selectFilteredApplicants, selectStatus, selectPagination, selectSelection } from '@/features/admisiones/store/selectors';
import { toggleSelect, clearSelection } from '@/features/admisiones/store/slice';
import '@/features/admisiones/styles/admisiones.light.css'

/**
 * AspirantesListPage
 * - Modo claro Bulma por defecto (no usa clases de modo oscuro).
 * - Agrega un botón "Ver" (router Link) para ir a /admin/aspirantes/:id.
 * - Feedback visual simple con notificación local en acciones (CSV).
 */
export default function AspirantesListPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectFilteredApplicants);
  const status = useSelector(selectStatus);
  const pagination = useSelector(selectPagination);
  const selection = useSelector(selectSelection);

  const [notice, setNotice] = useState<{ kind: 'success'|'danger'|'info'; msg: string } | null>(null);

  useEffect(() => {
    // Descarga inicial (paginada). Se mantiene en modo claro (Bulma por defecto).
    dispatch(fetchApplicantsPage(undefined) as any);
  }, [dispatch]);

  const onExport = async () => {
    try {
      await (dispatch(exportCsv() as any) as any);
      setNotice({ kind: 'success', msg: 'CSV exportado correctamente.' });
      setTimeout(() => setNotice(null), 2500);
    } catch {
      setNotice({ kind: 'danger', msg: 'No se pudo exportar el CSV.' });
    }
  };

  return (
    <section className="section users-scope">
      <h1 className="title has-text-black">Aspirantes</h1>
      <p className="subtitle is-6 has-text-primary-invert">Registro de aspirantes</p>
      {notice && (
        <div className={`notification is-${notice.kind}`}>
          <button className="delete" onClick={() => setNotice(null)} />
          {notice.msg}
        </div>
      )}

      <FiltersBar />

      <div className="buttons">
        <button className="button is-success" onClick={onExport}> <i className="fa-solid fa-file-csv mr-1"></i> <p>Exportar CSV</p> </button>
        {selection.ids.length > 0 && (
          <button className="button" onClick={() => dispatch(clearSelection())}>Limpiar selección</button>
        )}
      </div>

      <div className="table-container">
        <table className="table is-bordered is-fullwidth has-background-white ">
          <thead className='has-background-light'>
            <tr>
              <th></th>
              <th><p className='has-text-primary-dark'>Nombres</p></th>
              <th><p className='has-text-primary-dark'>Apellidos</p></th>
              <th><p className='has-text-primary-dark'>Grado</p></th>
              <th><p className='has-text-primary-dark'>Estado</p></th>
              <th><p className='has-text-primary-dark'>Autorizado</p></th>
              <th><p className='has-text-primary-dark'>Marca temporal</p></th>
              <th><p className='has-text-primary-dark'>Fuente</p></th>
              <th><p className='has-text-primary-dark'>Tags</p></th>
              <th><p className='has-text-primary-dark'>Acciones</p></th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selection.ids.includes(a.id)}
                    onChange={() => dispatch(toggleSelect(a.id))}
                  />
                </td>
                <td><p className='has-text-primary-invert'>{a.nombres.toUpperCase()}</p></td>
                <td><p className='has-text-primary-invert'>{a.apellidos.toUpperCase()}</p></td>
                <td><p className='has-text-primary-invert'>{a.ultimoGrado}</p></td>
                <td><EstadoBadge estado={a.estado } /></td>
                <td><p className='has-text-primary-invert'>{a.autorizadoMatricula ? 'Sí' : 'No'}</p></td>
                <td><p className='has-text-primary-invert'>{new Date(a.createdAt).toLocaleString()}</p></td>
                <td><p className='has-text-primary-invert'>{a.fuente.toUpperCase()}</p></td>
                <td>
                  <div className="tags">
                    {a.tags.map((t) => <span key={t} className="tag is-info">{t}</span>)}
                  </div>
                </td>
                <td className="has-text-right">
                  {/* Botón claro para ver el detalle (navegación declarativa) */}
                  <Link className="button is-small is-warning" to={`/admin/aspirantes/${a.id}`}>
                    <i className="fa-solid fa-eye mr-2"></i>
                    <p>Ver</p>
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={10}><em>No hay resultados con los filtros actuales.</em></td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="has-text-centered">
        {status === 'loading' && <progress className="progress is-small is-primary" max={100} />}
        {!pagination.hasMore ? (
          <p className="has-text-grey">No hay más resultados.</p>
        ) : (
          <button
            className={`button is-primary ${status === 'loading' ? 'is-loading' : ''}`}
            onClick={() => dispatch(fetchApplicantsPage({}) as any)}
          >
            Cargar más
          </button>
        )}
      </div>
    </section>
  );
}
