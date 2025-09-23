import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import EstadoBadge from '@/features/admisiones/components/EstadoBadge';
import TagsEditor from '@/features/admisiones/components/TagsEditor';
import AuthorizeMatriculaModal from '@/features/admisiones/components/AuthorizeMatriculaModal';
import NoAdmisionReasonModal from '@/features/admisiones/components/NoAdmisionReasonModal';
import { selectById } from '@/features/admisiones/store/selectors';
import { fetchApplicantsPage, updateEstado, authorizeMatricula, updateFuente, updateTags } from '@/features/admisiones/store/thunks';
import type { Estado } from '@/features/admisiones/types';
import { applicantsService } from '@/features/admisiones/services/applicants.service';
import '@/features/admisiones/styles/admisiones.light.css'

/**
 * AspiranteDetailPage
 * - Toma datos desde Redux; si no están en caché, intenta fetch puntual por id.
 * - Notificaciones Bulma tras acciones (guardar estado, fuente, tags, autorizar).
 * - Muestra email del usuario que autoriza (guardado en `autorizadoBy` como email).
 */
export default function AspiranteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  // Selector de Redux (memo para cambiar cuando cambie `id`)
  const applicant = useSelector(useMemo(() => selectById(id ?? ''), [id]));

  // Estado local UI
  const [showAuth, setShowAuth] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [estado, setEstado] = useState<Estado>('en_revision');
  const [fuente, setFuente] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [notice, setNotice] = useState<{ kind: 'success'|'danger'|'info'; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // Si no hay datos en Redux, intenta:
  // 1) cargar página (para entornos normales)
  // 2) fetch puntual por id como fallback.
  useEffect(() => {
    (async () => {
      if (!id) return;
      if (!applicant) {
        // intenta cargar más items
        await (dispatch(fetchApplicantsPage(undefined) as any) as any);
      }
    })();
  }, [dispatch, id, applicant]);

  // Fallback puntual por id si aún no existe en store
  useEffect(() => {
    (async () => {
      if (id && !applicant) {
        const one = await applicantsService.getById(id);
        if (!one) return;
        // Inyecta temporalmente a la UI (sin mutar el store); setea campos editables
        setEstado(one.estado);
        setFuente(one.fuente);
        setTags(one.tags);
      }
    })();
  }, [id, applicant]);

  useEffect(() => {
    if (applicant) {
      setEstado(applicant.estado);
      setFuente(applicant.fuente);
      setTags(applicant.tags);
    }
  }, [applicant]);

  if (!id) return null;

  const showOk = (msg: string) => {
    setNotice({ kind: 'success', msg });
    setTimeout(() => setNotice(null), 2500);
  };
  const showErr = (msg: string) => setNotice({ kind: 'danger', msg });

  return (
    <section className="section users-scope">
      <div className="level">
        <div className="level-left">
          <h1 className="title">Detalle de aspirante</h1>
        </div>
        <div className="level-right">
          <Link to={`/admin/aspirantes/${id}/ficha`} className="button is-light">Imprimir ficha</Link>
        </div>
      </div>

      {notice && (
        <div className={`notification is-${notice.kind}`}>
          <button className="delete" onClick={() => setNotice(null)} />
          {notice.msg}
        </div>
      )}

      {!applicant ? (
        <progress className="progress is-small is-primary" max={100} />
      ) : (
        <>
          <div className="box">
            {/* Encabezado */}
            <div className="columns">
              <div className="column">
                <p className="subtitle">{applicant.nombresApellidos}</p>
                <p className="has-text-grey">ID: {applicant.numeroIdentificacion}</p>
                <p><EstadoBadge estado={applicant.estado} /></p>
                <p className="mt-2">
                  <strong>Creado:</strong> {new Date(applicant.createdAt).toLocaleString()} ·{' '}
                  <strong>Actualizado:</strong> {new Date(applicant.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="column has-text-right">
                <button
                  className={`button is-success mr-2 ${applicant.autorizadoMatricula ? '' : ''}`}
                  onClick={() => setShowAuth(true)}
                  disabled={applicant.autorizadoMatricula}
                >
                  Autorizar matrícula
                </button>

                <div className="select">
                  <select value={estado} onChange={(e) => setEstado(e.target.value as Estado)}>
                    <option value="en_espera">En espera</option>
                    <option value="en_revision">En revisión</option>
                    <option value="admitido">Admitido</option>
                    <option value="no_admitido">No admitido</option>
                  </select>
                </div>
                <button
                  className={`button is-primary ml-2 ${saving ? 'is-loading' : ''}`}
                  onClick={async () => {
                    try {
                      setSaving(true);
                      if (estado === 'no_admitido') {
                        setShowReason(true);
                      } else {
                        await (dispatch(updateEstado({ id, estado }) as any) as any);
                        showOk('Estado guardado.');
                      }
                    } catch {
                      showErr('No se pudo guardar el estado.');
                    } finally {
                      setSaving(false);
                    }
                  }}
                >
                  Guardar estado
                </button>
              </div>
            </div>

            {/* Campos editables */}
            <div className="field">
              <label className="label">Fuente (editable)</label>
              <div className="control">
                <input className="input" value={fuente} onChange={(e) => setFuente(e.target.value)} />
              </div>
              <div className="control mt-2">
                <button
                  className="button"
                  onClick={async () => {
                    try {
                      await (dispatch(updateFuente({ id, fuente }) as any) as any);
                      showOk('Fuente actualizada.');
                    } catch {
                      showErr('No se pudo actualizar la fuente.');
                    }
                  }}
                >
                  Guardar fuente
                </button>
              </div>
            </div>

            <div className="field">
              <label className="label">Tags</label>
              <TagsEditor value={tags} onChange={setTags} />
              <div className="control mt-2">
                <button
                  className="button"
                  onClick={async () => {
                    try {
                      await (dispatch(updateTags({ id, tags }) as any) as any);
                      showOk('Tags actualizados.');
                    } catch {
                      showErr('No se pudieron actualizar los tags.');
                    }
                  }}
                >
                  Guardar tags
                </button>
              </div>
            </div>

            {/* Info de autorización (muestra email del actor que autorizó) */}
            <div className="notification is-light">
              <strong>Autorizado matrícula:</strong> {applicant.autorizadoMatricula ? 'Sí' : 'No'}
              {applicant.autorizadoBy ? (
                <> · <strong>por</strong> {applicant.autorizadoBy}</>
              ) : null}
              {applicant.autorizadoAt ? (
                <> · <strong>el</strong> {new Date(applicant.autorizadoAt).toLocaleString()}</>
              ) : null}
            </div>

            {/* Bloque informativo completo */}
            <div className="content">
              <h3 className="title is-5">Información básica</h3>
              <ul>
                <li><strong>Nombres:</strong> {applicant.nombres}</li>
                <li><strong>Apellidos:</strong> {applicant.apellidos}</li>
                <li><strong>Sexo:</strong> {applicant.sexo}</li>
                <li><strong>Fecha Nacimiento:</strong> {applicant.fechaNacimiento}</li>
                <li><strong>Lugar Nacimiento:</strong> {applicant.lugarNacimiento}</li>
                <li><strong>Teléfono:</strong> {applicant.telefono}</li>
                <li><strong>Teléfono Casa:</strong> {applicant.telefonoCasa}</li>
                <li><strong>Dirección:</strong> {applicant.direccionResidencia}</li>
                <li><strong>Barrio:</strong> {applicant.barrioAspirante}</li>
                <li><strong>Colegio procedencia:</strong> {applicant.colegioProcedencia}</li>
                <li><strong>Último grado:</strong> {applicant.ultimoGrado}</li>
                <li><strong>Religión:</strong> {applicant.religion}</li>
                <li><strong>Familiares en colegio:</strong> {applicant.familiaresEnColegio}</li>
                <li><strong>Recomendador:</strong> {applicant.recomendador?.nombresApellidos} ({applicant.recomendador?.parentesco}) · {applicant.recomendador?.telefono}</li>
              </ul>

              <h3 className="title is-5">Madre</h3>
              <ul>
                <li><strong>Nombre:</strong> {applicant.madre?.nombresApellidos}</li>
                <li><strong>Identificación:</strong> {applicant.madre?.numeroIdentificacion}</li>
                <li><strong>Profesión:</strong> {applicant.madre?.profesion}</li>
                <li><strong>Empresa:</strong> {applicant.madre?.empresa}</li>
                <li><strong>Dirección:</strong> {applicant.madre?.direccion}</li>
                <li><strong>Barrio:</strong> {applicant.madre?.barrio}</li>
                <li><strong>Teléfono:</strong> {applicant.madre?.telefono}</li>
                <li><strong>Email:</strong> {applicant.madre?.email}</li>
              </ul>

              <h3 className="title is-5">Padre</h3>
              <ul>
                <li><strong>Nombre:</strong> {applicant.padre?.nombresApellidos}</li>
                <li><strong>Identificación:</strong> {applicant.padre?.numeroIdentificacion}</li>
                <li><strong>Profesión:</strong> {applicant.padre?.profesion}</li>
                <li><strong>Empresa:</strong> {applicant.padre?.empresa}</li>
                <li><strong>Dirección:</strong> {applicant.padre?.direccion}</li>
                <li><strong>Barrio:</strong> {applicant.padre?.barrio}</li>
                <li><strong>Teléfono:</strong> {applicant.padre?.telefono}</li>
                <li><strong>Email:</strong> {applicant.padre?.email}</li>
              </ul>
            </div>
          </div>

          {/* Modales */}
          <AuthorizeMatriculaModal
            isOpen={showAuth}
            onClose={() => setShowAuth(false)}
            onConfirm={async () => {
              try {
                setShowAuth(false);
                await (dispatch(authorizeMatricula({ id }) as any) as any);
                showOk('Matrícula autorizada.');
              } catch {
                showErr('No se pudo autorizar la matrícula.');
              }
            }}
          />

          <NoAdmisionReasonModal
            isOpen={showReason}
            onClose={() => setShowReason(false)}
            onConfirm={async (reason) => {
              try {
                setShowReason(false);
                await (dispatch(updateEstado({ id, estado: 'no_admitido', motivo: reason }) as any) as any);
                showOk('Estado actualizado con motivo.');
              } catch {
                showErr('No se pudo actualizar el estado.');
              }
            }}
          />
        </>
      )}
    </section>
  );
}
