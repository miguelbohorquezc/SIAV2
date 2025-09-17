/* ============================================
 * AspirantesAdminPage.tsx
 * Página host para administración (read-only)
 * - Conecta hook + servicio (stubs).
 * - Habilita paginación básica.
 * ============================================
 */
import { useEffect, useMemo, type JSX } from 'react';
import { BULMA_CLASSES } from '../constants/aspirantes-admin.constants';
import ApplicantsTable from '../components/ApplicantsTable';
import { useAspirantesAdmin } from '../hooks/useAspirantesAdmin';
import { createAspirantesAdminService } from '../services/aspirantesAdmin.service';

/* ANCLA RUTA LAZY
// [ASPIRANTES_ADMIN:ROUTE_EXPORT]
export const ASPIRANTES_ADMIN_ROUTE = '/admin/aspirantes';
*/

export default function AspirantesAdminPage(): JSX.Element {
  // Instancia del servicio (DI) — se conectará a Firestore en turnos siguientes
  const service = useMemo(() => createAspirantesAdminService({ /* firestore: TBD */ }), []);
  const { state, load, setPage } = useAspirantesAdmin(service);

  // Carga inicial (solo lectura)
  useEffect(() => {
    void load({ page: state.page, pageSize: state.pageSize });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    setPage(page);
    void load({ page, pageSize: state.pageSize, search: state.filtro });
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title is-4">Administración de Aspirantes</h1>
        <p className="subtitle is-6">Gestiona creación, edición, filtros y exportación.</p>

        {/* [ASPADM:PAGE:FILTER_BAR] — placeholder visual */}
        <div className="box">
          <div className="field is-grouped">
            <div className="control is-expanded">
              <input
                className={BULMA_CLASSES.input}
                placeholder="Buscar por nombre o documento"
                aria-label="Buscar aspirantes"
                disabled
              />
            </div>
            <div className="control">
              <button className={BULMA_CLASSES.buttonPrimary} disabled>Buscar</button>
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
