import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import FiltersBar from '@/features/admisiones/components/FilterBar';
import EstadoBadge from '@/features/admisiones/components/EstadoBadge';
import { fetchApplicantsPage, exportCsv } from '@/features/admisiones/store/thunks';
import { selectFilteredApplicants, selectStatus, selectPagination, selectSelection } from '@/features/admisiones/store/selectors';
import { toggleSelect, clearSelection } from '@/features/admisiones/store/slice';
import '@/features/admisiones/styles/admisiones.light.css'
import logo from '@/assets/Logo-img.png'

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
      <figure className="image is-64x64">
          <img src={logo} alt="logo" className='m-2' />
        </figure>
        <h1 className="title has-text-black">Aspirantes</h1>
        <p className="subtitle has-text-black">Complete los pasos del formulario</p>
        <article className="message is-info mb-1">
          <div className="message-body has-text-black has-background-white">
            <i className="fa-solid fa-circle-info mr-1 has-text-black"></i>
            En este espacio podrás filtrar, consultar y dar seguimiento al proceso de inscripción de cada aspirante.
            Recuerda verificar y completar la información faltante para asegurar que el registro y la evaluación del aspirante se realicen correctamente.
            </div>
        </article>
      {notice && (
        <div className={`notification is-${notice.kind}`}>
          <button className="delete" onClick={() => setNotice(null)} />
          {notice.msg}
        </div>
      )}

      <FiltersBar />

      <div className="buttons">
        <button className="button" onClick={onExport}> <i className="fa-solid fa-file-csv has-text-success-40 mr-1"></i> <p className='has-text-success-40'>Exportar CSV</p> </button>
        {selection.ids.length > 0 && (
          <button className="button" onClick={() => dispatch(clearSelection())}>Limpiar selección</button>
        )}
      </div>

      <div className="table-container">
        <table className="table is-bordered is-fullwidth has-background-white ">
          <thead className='has-background-light'>
            <tr>
              <th><i className="fa-solid fa-user mr-1"></i></th>
              <th><p className='has-text-primary-dark'>Identificación</p></th>
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
                <td><p className='has-text-primary-invert'>{a.nIdentificacion.toUpperCase()}</p></td>
                <td><p className='has-text-primary-invert'>{a.nombres.toUpperCase()}</p></td>
                <td><p className='has-text-primary-invert'>{a.apellidos.toUpperCase()}</p></td>
                <td><p className='has-text-primary-invert'>{a.gradoAspira.toUpperCase()}</p></td>
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
                    <i className="fa-solid fa-eye mr-2 has-text-warning-20"></i>
                    <p className='has-text-warning-20'>Ver</p>
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
