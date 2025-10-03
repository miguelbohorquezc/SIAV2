import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import EstadoBadge from '@/features/admisiones/components/EstadoBadge';
import TagsEditor from '@/features/admisiones/components/TagsEditor';
import AuthorizeMatriculaModal from '@/features/admisiones/components/AuthorizeMatriculaModal';
import NoAdmisionReasonModal from '@/features/admisiones/components/NoAdmisionReasonModal';
import { selectById } from '@/features/admisiones/store/selectors';
import {
  fetchApplicantsPage,
  updateEstado,
  authorizeMatricula,
  revokeMatricula,
  updateFuente,
  updateTags,
} from '@/features/admisiones/store/thunks';
import type { Estado } from '@/features/admisiones/types';
import { applicantsService } from '@/features/admisiones/services/applicants.service';
import '@/features/admisiones/styles/admisiones.light.css';

// ⬇️⬇️⬇️ AÑADIDO: action para insertar/actualizar en el store en vivo
import { upsertOne } from '@/features/admisiones/store/slice';

/**
 * AspiranteDetailPage
 * - Datos desde Redux; si no están, fallback puntual por id.
 * - Feedback Bulma en acciones.
 * - Autorizar / Revocar autorización con auditoría.
 */
export default function AspiranteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const applicant = useSelector(useMemo(() => selectById(id ?? ''), [id]));

  const [showAuth, setShowAuth] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [showRevoke, setShowRevoke] = useState(false); // <-- AÑADIDO
  const [estado, setEstado] = useState<Estado>('en_revision');
  const [fuente, setFuente] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [notice, setNotice] = useState<{ kind: 'success' | 'danger' | 'info'; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      if (!applicant) {
        await (dispatch(fetchApplicantsPage(undefined) as any) as any);
      }
    })();
  }, [dispatch, id, applicant]);

  useEffect(() => {
    (async () => {
      if (id && !applicant) {
        const one = await applicantsService.getById(id);
        if (one) {
          setEstado(one.estado);
          setFuente(one.fuente);
          setTags(one.tags);
        }
      }
    })();
  }, [id, applicant]);

  // ⬇️⬇️⬇️ AÑADIDO: suscripción en vivo al documento (onSnapshot)
  useEffect(() => {
    if (!id) return;
    if (typeof applicantsService.watchById !== 'function') return; // por si aún no se añadió
    const unsubscribe = applicantsService.watchById(id, (doc) => {
      if (doc) {
        // Empuja la versión más reciente del doc al store sin perder tu estado local
        dispatch(upsertOne(doc as any));
      }
    });
    return () => {
      try { unsubscribe && unsubscribe(); } catch {}
    };
  }, [id, dispatch]);

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
          <Link to={`/admin/aspirantes/${id}/ficha`} className="button is-alert has-text-white"><i className="fa-solid fa-print mr-2"></i>Imprimir ficha</Link>
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
            {/* Tabla ficha de matrícula -------------------------------------------------------------- */}
            <div className="columns">
              <div className="column">
                <span className="tag is-info is-light mb-1">
                  <i className="fa-solid fa-graduation-cap mr-1"></i>{applicant.apellidos.toUpperCase()} {applicant.nombres.toUpperCase()}
                </span>
                <span className="tag is-light ml-2 has-text-dark">
                  <i className="fa-solid fa-id-card-clip mr-1"></i>
                  <p className='mr-2'>Registro:</p><strong className='has-text-weight-bold has-text-black pl-1'>{applicant.id}</strong>
                </span>
                <span className="tag is-primary is-light ml-2 has-text-dark">
                  <i className="fa-solid fa-address-card mr-1"></i>
                  <p className='mr-2'>Identificación:</p><strong className='has-text-weight-bold has-text-black pl-1'>{applicant.nIdentificacion}</strong>
                </span>
                <span>
                  <p><EstadoBadge estado={applicant.estado} /></p>
                </span>
                <p className="mt-2">
                  <strong className="has-text-primary-dark">Creado:</strong> {new Date(applicant.createdAt).toLocaleString()} ·{' '}
                  <strong className="has-text-primary-dark">Actualizado:</strong> {new Date(applicant.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="column has-text-right">
                {/* Autorizar */}
                {applicant.estado !== 'admitido' && !applicant.autorizadoMatricula && (
                  <p className="help is-warning mb-2">
                    Para autorizar, primero cambia el estado a <strong className='has-text-warning'>admitido</strong>.
                  </p>
                )}
                <div className="dropdown is-hoverable">
                  <div className="dropdown-trigger">
                    <button
                      aria-haspopup="true"
                      aria-controls="dropdown-menu4"
                      className={`button is-warning mr-2 ${applicant.autorizadoMatricula ? '' : ''}`}
                      onClick={() => setShowAuth(true)}
                      disabled={applicant.autorizadoMatricula || applicant.estado !== 'admitido'}
                      title={
                        applicant.autorizadoMatricula
                          ? 'Ya autorizado'
                          : applicant.estado !== 'admitido'
                          ? 'Requiere estado: admitido'
                          : ''
                      }
                    >
                      <i className="fa-solid fa-person-chalkboard mr-1"></i>
                      {applicant.autorizadoMatricula ? 'Ya autorizado' : 'Autorizar matrícula'}
                    </button>
                  </div>
                  <div className="dropdown-menu" id="dropdown-menu4" role="menu">
                    <div className="dropdown-content">
                      <div className="dropdown-item">
                        <p>
                          Al autorizar <strong>la matrícula</strong>, se pondrá en marcha el proceso de matrícula de este estudiante.
                          [Dirección, Secretaría, Coordinación académica]
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revocar autorización */}
                {applicant.autorizadoMatricula && (
                  <button
                    className={`button is-danger ml-2 ${revoking ? 'is-loading' : ''}`}
                    onClick={() => setShowRevoke(true)} // <-- CAMBIADO (antes window.prompt)
                    title="Revocar autorización de matrícula"
                  >
                    <i className="fa-solid fa-rotate-left mr-1" /> Revocar autorización
                  </button>
                )}

                {/* Estado */}
                <div className="select ml-3 mb-2">
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
            {/* --------------------------------------------------------------------------------------- */}
            <div className="grid notification is-light">
              {/* Fuente */}
              <div className="cell">
                <label className="label">Fuente (editable)</label>
                <div className="control">
                  <input className="input" value={fuente} onChange={(e) => setFuente(e.target.value)} />
                </div>
                <div className="control mt-4">
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

              {/* Tags */}
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

              {/* Info autorización */}
              <div className="notification is-light">
                <strong>Autorizado matrícula:</strong> {applicant.autorizadoMatricula ? 'Sí' : 'No'}
                {applicant.autorizadoBy ? <> · <strong>por</strong> {applicant.autorizadoBy}</> : null}
                {applicant.autorizadoAt ? <> · <strong>el</strong> {new Date(applicant.autorizadoAt).toLocaleString()}</> : null}
              </div>
            </div>

            {/* Información completa */}
            <div className="content">
              <div className="grid section users-scope">
                <div className="content grid ">
                  <div className='cell is-col-span-10 '>
                    <table className="table is-bordered is-fullwidth has-background-white">
                        <colgroup>
                          <col style={{ width: "15%" }} />
                          <col style={{ width: "20%" }} />
                          <col style={{ width: "30%" }} />
                          <col style={{ width: "35%" }} />
                        </colgroup>

                        <thead className="has-background-light">
                          <tr>
                            <th colSpan={4} align='center'>
                              <p className="has-text-primary-dark">DATOS DE IDENTIFICACIÓN DEL ASPIRANTE</p>
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {/* Fila 1 */}
                          <tr>
                            <td>
                              <strong className="has-text-primary-dark">Tipo documento:</strong>
                              <p className="has-text-primary-dark">{applicant.TIdentificacion.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Número de identificación:</strong>
                              <p className="has-text-primary-dark">{applicant.nIdentificacion.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Nombres:</strong>
                              <p className="has-text-primary-dark">{applicant.nombres.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Apellidos:</strong>
                              <p className="has-text-primary-dark">{applicant.apellidos.toUpperCase()}</p>
                            </td>
                          </tr>

                          {/* Fila 2 */}
                          <tr>
                            <td>
                              <strong className="has-text-primary-dark">Fecha nacimiento:</strong>
                              <p className="has-text-primary-dark">{applicant.fechaNacimiento}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Lugar de nacimiento:</strong>
                              <p className="has-text-primary-dark">{applicant.lugarNacimiento.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Sexo:</strong>
                              <p className="has-text-primary-dark">{applicant.sexo.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Edad:</strong>
                              <p className="has-text-primary-dark">
                                {`${applicant.edadAnios} años, ${applicant.edadMeses} meses`}
                              </p>
                            </td>
                          </tr>

                          {/* Fila 3 → aquí ampliamos celdas */}
                          <tr>
                            <td colSpan={1}>
                              <strong className="has-text-primary-dark">Dirección de residencia:</strong>
                              <p className="has-text-primary-dark">{applicant.direccionResidencia.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Barrio:</strong>
                              <p className="has-text-primary-dark">{applicant.barrioAspirante.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Teléfono de residencia:</strong>
                              <p className="has-text-primary-dark">{applicant.telefonoCasa.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Creencia.   Religión:</strong>
                              <p className="has-text-primary-dark">{applicant.religion.toUpperCase()}</p>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong className="has-text-primary-dark">Grado al que aspira:</strong>
                              <p className="has-text-primary-dark">{applicant.gradoAspira.toUpperCase()}</p>
                            </td>
                            <td colSpan={2}>
                              <strong className="has-text-primary-dark">Colego Procedencia:</strong>
                              <p className="has-text-primary-dark">{applicant.colegioProcedencia.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Último grado cursado:</strong>
                                <p className="has-text-primary-dark">{applicant.ultimoGrado.toUpperCase()}</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <table className="table is-bordered is-fullwidth has-background-white">
                        <colgroup>
                          <col style={{ width: "20%" }} />
                          <col style={{ width: "25%" }} />
                          <col style={{ width: "25%" }} />
                          <col style={{ width: "30%" }} />
                        </colgroup>

                        <thead className="has-background-light">
                          <tr>
                            <th colSpan={4} align='center'>
                              <p className="has-text-primary-dark">INFORMACIÓN DE LOS PADRES</p>
                            </th>
                          </tr>
                          <tr>
                            <th colSpan={4}>
                              <p className="has-text-primary-dark">DATOS DEL PADRE</p>
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {/* Fila 1 */}
                          <tr>
                            <td>
                              <strong className="has-text-primary-dark">Número de identificación:</strong>
                              <p className="has-text-primary-dark">{applicant.padre.numeroIdentificacion}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Nombres y apellidos:</strong>
                              <p className="has-text-primary-dark">{applicant.padre.nombresApellidos.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Dirección:</strong>
                              <p className="has-text-primary-dark">{applicant.padre.direccion.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Barrio:</strong>
                              <p className="has-text-primary-dark">{applicant.padre.barrio.toUpperCase()}</p>
                            </td>
                          </tr>

                          {/* Fila 2 */}
                          <tr>
                            <td>
                              <strong className="has-text-primary-dark">Empresa donde trabaja:</strong>
                              <p className="has-text-primary-dark">{applicant.padre.empresa.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Email:</strong>
                              <p className="has-text-primary-dark">{applicant.padre.email.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Profesión:</strong>
                              <p className="has-text-primary-dark">{applicant.padre.profesion.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Teléfono:</strong>
                              <p className="has-text-primary-dark">
                                {applicant.padre.telefono}
                              </p>
                            </td>
                          </tr>

                          
                        </tbody>
                      </table>

                      <table className="table is-bordered is-fullwidth has-background-white">
                        <colgroup>
                          <col style={{ width: "20%" }} />
                          <col style={{ width: "25%" }} />
                          <col style={{ width: "25%" }} />
                          <col style={{ width: "30%" }} />
                        </colgroup>

                        <thead className="has-background-light">
                          <tr>
                            <th colSpan={4} align='center'>
                              <p className="has-text-primary-dark">INFORMACIÓN DE LOS PADRES</p>
                            </th>
                          </tr>
                          <tr>
                            <th colSpan={4}>
                              <p className="has-text-primary-dark">DATOS DE LA MADRE</p>
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {/* Fila 1 */}
                          <tr>
                            <td>
                              <strong className="has-text-primary-dark">Número de identificación:</strong>
                              <p className="has-text-primary-dark">{applicant.madre.numeroIdentificacion}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Nombres y apellidos:</strong>
                              <p className="has-text-primary-dark">{applicant.madre.nombresApellidos.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Dirección:</strong>
                              <p className="has-text-primary-dark">{applicant.madre.direccion.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Barrio:</strong>
                              <p className="has-text-primary-dark">{applicant.madre.barrio.toUpperCase()}</p>
                            </td>
                          </tr>

                          {/* Fila 2 */}
                          <tr>
                            <td>
                              <strong className="has-text-primary-dark">Empresa donde trabaja:</strong>
                              <p className="has-text-primary-dark">{applicant.madre.empresa.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Email:</strong>
                              <p className="has-text-primary-dark">{applicant.madre.email.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Profesión:</strong>
                              <p className="has-text-primary-dark">{applicant.madre.profesion.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Teléfono:</strong>
                              <p className="has-text-primary-dark">
                                {applicant.madre.telefono}
                              </p>
                            </td>
                          </tr> 
                        </tbody>
                      </table>

                      <table className="table is-bordered is-fullwidth has-background-white">
                        <colgroup>
                          <col style={{ width: "20%" }} />
                          <col style={{ width: "25%" }} />
                          <col style={{ width: "25%" }} />
                          <col style={{ width: "30%" }} />
                        </colgroup>

                        <thead className="has-background-light">
                          <tr>
                            <th colSpan={4} align='center'>
                              <p className="has-text-primary-dark">PERSONA QUE RECOMENDÓ EL CENTRO EDUCATIVO</p>
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {/* Fila 1 */}
                          <tr>
                            <td colSpan={2}>
                              <strong className="has-text-primary-dark">Nombres y apellidos:</strong>
                              <p className="has-text-primary-dark">{applicant.recomendador.nombresApellidos.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Parentesco:</strong>
                              <p className="has-text-primary-dark">{applicant.recomendador.parentesco.toUpperCase()}</p>
                            </td>
                            <td>
                              <strong className="has-text-primary-dark">Teléfono:</strong>
                              <p className="has-text-primary-dark">{applicant.recomendador.telefono}</p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                  </div>
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

          {/* Reutilización del mismo modal para REVOCAR autorización */}
          <NoAdmisionReasonModal
            isOpen={showRevoke}
            onClose={() => setShowRevoke(false)}
            title="Motivo de revocación"
            confirmLabel="Revocar"
            required={false}
            placeholder="Si lo deseas, explica por qué revocas la autorización…"
            onConfirm={async (reason) => {
              try {
                setShowRevoke(false);
                setRevoking(true);
                await (dispatch(revokeMatricula({ id, reason: reason || undefined }) as any) as any);
                showOk('Autorización revocada.');
              } catch {
                showErr('No se pudo revocar la autorización.');
              } finally {
                setRevoking(false);
              }
            }}
          />
        </>
      )}
    </section>
  );
}
