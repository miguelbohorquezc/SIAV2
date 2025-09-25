/* ============================================
 * AspirantesAdminPage.tsx
 * Página host para administración (read-only)
 * - Conecta hook + servicio (Firestore listo)
 * - Búsqueda y paginación básica
 * ============================================
 */
import { useEffect, useMemo, useState, type JSX } from 'react';
import { BULMA_CLASSES } from '../constants/aspirantes-admin.constants';
import ApplicantsTable from '../components/ApplicantsTable';
import { useAspirantesAdmin } from '../hooks/useAspirantesAdmin';
import { createAspirantesAdminService } from '../services/aspirantesAdmin.service';

// [ASPIRANTES_ADMIN:ROUTE_EXPORT]
export const ASPIRANTES_ADMIN_ROUTE = '/admin/aspirantes';

export default function AspirantesAdminPage(): JSX.Element {
  // ⚠️ Apuntamos a la colección real: 'applicants'
  const service = useMemo(
    () => createAspirantesAdminService({ collectionPath: 'applicants' }),
    []
  );

  const { state, load, setPage } = useAspirantesAdmin(service);
  const [search, setSearch] = useState<string>('');

  // Carga inicial y cuando cambie pageSize, repetir consulta con el filtro actual
  useEffect(() => {
    void load({ page: state.page, pageSize: state.pageSize, search });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.pageSize]);

  const handlePageChange = (page: number) => {
    setPage(page);
    void load({ page, pageSize: state.pageSize, search });
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title is-4">Administración de Aspirantes</h1>
        <p className="subtitle is-6">Gestiona creación, edición, filtros y exportación.</p>

        {/* [ASPADM:PAGE:FILTER_BAR] — búsqueda básica */}
        <div className="box">
          <div className="field is-grouped is-align-items-flex-end">
            <div className="control is-expanded">
              <label className="label" htmlFor="search">Buscar</label>
              <input
                id="search"
                className={BULMA_CLASSES.input}
                placeholder="Documento o nombre"
                aria-label="Buscar aspirantes"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="control">
              <button
                className={BULMA_CLASSES.buttonPrimary}
                onClick={() => {
                  setPage(1);
                  void load({ page: 1, pageSize: state.pageSize, search });
                }}
                disabled={state.loading}
                aria-disabled={state.loading}
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="box">
          <ApplicantsTable
            items={state.items}
            loading={state.loading}
            page={state.page}
            pageSize={state.pageSize}
            total={state.total}
            /* [ASPADM:TABLE:EVENTS] — acciones quedan deshabilitadas por ahora */
            onEdit={() => {}}
            onToggleFlag={() => {}}
            onPageChange={handlePageChange}
            onExport={() => {}}
          />
          {state.error && (
            <p className="help is-danger" role="alert" aria-live="assertive">
              {state.error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
