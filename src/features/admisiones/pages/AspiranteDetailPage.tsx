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
          <h1 className="title has-text-black">Detalle de aspirante</h1>
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
                <span className="tag is-light mb-1">{applicant.apellidos.toUpperCase()} {applicant.nombres.toUpperCase()}</span>
                <p><EstadoBadge estado={applicant.estado} /></p>
                <p className="mt-2">
                  <strong className='has-text-primary-dark'>Creado:</strong> {new Date(applicant.createdAt).toLocaleString()} ·{' '}
                  <strong className='has-text-primary-dark'>Actualizado:</strong> {new Date(applicant.updatedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <div>
                  <div className="column has-text-right">
                    <div className="dropdown is-hoverable">
                      <div className="dropdown-trigger">
                        <button
                            aria-haspopup="true"
                            aria-controls="dropdown-menu4"
                            className={`button is-warning mr-2 ${applicant.autorizadoMatricula ? '' : ''}`}
                            onClick={() => setShowAuth(true)}
                            disabled={applicant.autorizadoMatricula}
                          >
                            <i className="fa-solid fa-person-chalkboard mr-1"></i>
                            Autorizar matrícula
                        </button>
                      </div>
                      <div className="dropdown-menu" id="dropdown-menu4" role="menu">
                        <div className="dropdown-content">
                          <div className="dropdown-item">
                            <p>
                              Al autorizar <strong>la matrícula</strong>, se pondrá en marcha el proceso de matrícula de este estudiante.
                            </p>
                          </div>
                        </div>
                      </div>
                  </div>

{/* <div class="dropdown is-hoverable">
  <div class="dropdown-trigger">
    <button class="button" aria-haspopup="true" aria-controls="dropdown-menu4">
      <span>Hover me</span>
      <span class="icon is-small">
        <i class="fas fa-angle-down" aria-hidden="true"></i>
      </span>
    </button>
  </div>
  <div class="dropdown-menu" id="dropdown-menu4" role="menu">
    <div class="dropdown-content">
      <div class="dropdown-item">
        <p>
          You can insert <strong>any type of content</strong> within the
          dropdown menu.
        </p>
      </div>
    </div>
  </div>
</div> */}
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
              </div>
            </div>
            
            <div className='grid notification is-light'>
              {/* Campos editables */}
              <div className="cell">
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

              <div className="cell">
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
            </div>

            {/* Bloque informativo completo */}
            <div className="content ">
              <h3 className="title is-5">Información básica</h3>
              <div className='grid section users-scope'>
                <div className='cell'>
                  <h3 className="title is-5">Aspirante</h3>
                  <ul>
                    <li><strong className='has-text-primary-dark'>Nombres:</strong> {applicant.nombres.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Apellidos:</strong> {applicant.apellidos.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Sexo:</strong> {applicant.sexo.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Fecha Nacimiento:</strong> {applicant.fechaNacimiento.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Lugar Nacimiento:</strong> {applicant.lugarNacimiento.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Teléfono:</strong> {applicant.telefono.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Teléfono Casa:</strong> {applicant.telefonoCasa.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Dirección:</strong> {applicant.direccionResidencia.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Barrio:</strong> {applicant.barrioAspirante.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Colegio procedencia:</strong> {applicant.colegioProcedencia.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Último grado:</strong> {applicant.ultimoGrado.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Religión:</strong> {applicant.religion.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Familiares en colegio:</strong> {applicant.familiaresEnColegio.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Recomendador:</strong> {applicant.recomendador?.nombresApellidos.toUpperCase()} ({applicant.recomendador?.parentesco.toUpperCase()}) · {applicant.recomendador?.telefono.toUpperCase()}</li>
                  </ul>
                </div>
                <div className='cell'>
                  <h3 className="title is-5">Madre</h3>
                  <ul>
                    <li><strong className='has-text-primary-dark'>Nombre:</strong> {applicant.madre?.nombresApellidos.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Identificación:</strong> {applicant.madre?.numeroIdentificacion.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Profesión:</strong> {applicant.madre?.profesion.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Empresa:</strong> {applicant.madre?.empresa.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Dirección:</strong> {applicant.madre?.direccion.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Barrio:</strong> {applicant.madre?.barrio.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Teléfono:</strong> {applicant.madre?.telefono.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Email:</strong> {applicant.madre?.email.toUpperCase()}</li>
                  </ul>
                </div>
                <div className='cell'>
                  <h3 className="title is-5">Padre</h3>
                  <ul>
                    <li><strong className='has-text-primary-dark'>Nombre:</strong> {applicant.padre?.nombresApellidos.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Identificación:</strong> {applicant.padre?.numeroIdentificacion.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Profesión:</strong> {applicant.padre?.profesion.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Empresa:</strong> {applicant.padre?.empresa.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Dirección:</strong> {applicant.padre?.direccion.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Barrio:</strong> {applicant.padre?.barrio.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Teléfono:</strong> {applicant.padre?.telefono.toUpperCase()}</li>
                    <li><strong className='has-text-primary-dark'>Email:</strong> {applicant.padre?.email.toUpperCase()}</li>
                  </ul>
                </div>
              </div>
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
