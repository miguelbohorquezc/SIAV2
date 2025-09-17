/* ============================================
 * ApplicantsTable.tsx
 * Tabla mínima Bulma (tema claro)
 * - Render de filas (read-only)
 * - Paginación básica: prev/next y salto a última página
 * ============================================
 */
import { type JSX } from 'react';
import type { AspiranteDTO } from '../types/aspirantes-admin.types';
import { BULMA_CLASSES, TABLE_PAGE_SIZE_OPTIONS } from '../constants/aspirantes-admin.constants';

export interface ApplicantsTableProps {
  items: AspiranteDTO[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onEdit: (id: string) => void;
  onToggleFlag: (id: string, flag: keyof NonNullable<AspiranteDTO['flags']>, value: boolean) => void;
  onPageChange: (page: number) => void;
  onExport: () => void;
}

export default function ApplicantsTable(props: ApplicantsTableProps): JSX.Element {
  const { items, loading, page, pageSize, total } = props;
  const totalPages = Math.max(1, Math.ceil((total || 0) / Math.max(1, pageSize || 1)));

  return (
    <div aria-live="polite">
      {/* Barra de acciones */}
      <div className="level mb-3">
        <div className="level-left">
          <div className="level-item">
            <button
              className={BULMA_CLASSES.buttonPrimary}
              onClick={props.onExport}
              disabled
              aria-disabled="true"
              aria-label="Exportar aspirantes a CSV"
              title="Exportar CSV (próximamente)"
            >
              Exportar CSV
            </button>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <div className="select is-small" aria-label="Tamaño de página">
              <select disabled defaultValue={pageSize}>
                {TABLE_PAGE_SIZE_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt} / pág.</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-container">
        <table
          className={BULMA_CLASSES.table}
          role="table"
          aria-busy={loading}
          aria-describedby="aspirantes-table-caption"
        >
          <caption id="aspirantes-table-caption" className="is-sr-only">
            Tabla de aspirantes
          </caption>
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Documento</th>
              <th scope="col">Grado</th>
              <th scope="col">Estado</th>
              <th scope="col">Público</th>
              <th scope="col" className="has-text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Empty state */}
            {(!items || items.length === 0) && (
              <tr>
                <td colSpan={6}>
                  <p className="has-text-grey has-text-centered">No hay registros aún.</p>
                </td>
              </tr>
            )}

            {/* Filas (read-only) */}
            {items && items.map((it) => {
              const nombre = `${it.apellidos ?? ''} ${it.nombres ?? ''}`.trim();
              const flagPublico = Boolean(it.flags?.publico);
              return (
                <tr key={it.id || `${it.documento}-${nombre}`}>
                  <td>{nombre || '—'}</td>
                  <td>{it.documento || '—'}</td>
                  <td>{it.grado || '—'}</td>
                  <td>
                    <span className="tag is-info is-light">{it.estado}</span>
                  </td>
                  <td>
                    <span className="tag is-light">{flagPublico ? 'Sí' : 'No'}</span>
                  </td>
                  <td className="has-text-right">
                    <button className="button is-small" disabled title="Editar (próximamente)">
                      Editar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <nav className="pagination is-right mt-3" role="navigation" aria-label="paginación">
        <button
          className="pagination-previous"
          onClick={() => props.onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          aria-disabled={page <= 1}
        >
          Anterior
        </button>
        <button
          className="pagination-next"
          onClick={() => props.onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          aria-disabled={page >= totalPages}
        >
          Siguiente
        </button>
        <ul className="pagination-list">
          <li>
            <a className="pagination-link is-current" aria-label={`Página ${page}`} aria-current="page">
              {page}
            </a>
          </li>
          {totalPages > page + 1 && (
            <>
              <li><span className="pagination-ellipsis">&hellip;</span></li>
              <li>
                <a
                  className="pagination-link"
                  aria-label={`Página ${totalPages}`}
                  onClick={() => props.onPageChange(totalPages)}
                >
                  {totalPages}
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
