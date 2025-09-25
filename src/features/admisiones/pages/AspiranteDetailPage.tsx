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
            <div className="columns">
              <div className="column">
                <span className="tag is-light mb-1">
                  {applicant.apellidos.toUpperCase()} {applicant.nombres.toUpperCase()}
                </span>
                <span className="tag is-info ml-2 has-text-dark">
                  <p className='mr-2'>Registro:</p>{applicant.id}
                </span>
                <span className="tag is-secondary ml-2 has-text-white">
                  <p className='mr-2'>Identificación:</p>{applicant.nIdentificacion}
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
                <div className="select ml-3">
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

            <div className="grid notification is-light">
              {/* Fuente */}
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
              <h3 className="title is-5">Información básica</h3>
              <div className="grid section users-scope">
                <div className="cell">
                  <h3 className="title is-5">Aspirante</h3>
                  <ul>
                    <li><strong className="has-text-primary-dark">ID-REGISTRO:</strong> {applicant.id}</li>
                    <li><strong className="has-text-primary-dark">Número Identidad:</strong> {applicant.nIdentificacion}</li>
                    <li><strong className="has-text-primary-dark">Nombres:</strong> {applicant.nombres.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Apellidos:</strong> {applicant.apellidos.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Sexo:</strong> {applicant.sexo.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Fecha Nacimiento:</strong> {applicant.fechaNacimiento.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Lugar Nacimiento:</strong> {applicant.lugarNacimiento.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Teléfono:</strong> {applicant.telefono.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Teléfono Casa:</strong> {applicant.telefonoCasa.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Dirección:</strong> {applicant.direccionResidencia.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Barrio:</strong> {applicant.barrioAspirante.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Colegio procedencia:</strong> {applicant.colegioProcedencia.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Último grado:</strong> {applicant.ultimoGrado.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Religión:</strong> {applicant.religion.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Familiares en colegio:</strong> {applicant.familiaresEnColegio.toUpperCase()}</li>
                    <li>
                      <strong className="has-text-primary-dark">Recomendador:</strong>{' '}
                      {applicant.recomendador?.nombresApellidos?.toUpperCase()} ({applicant.recomendador?.parentesco?.toUpperCase()})
                      {' · '}
                      {applicant.recomendador?.telefono?.toUpperCase()}
                    </li>
                  </ul>
                </div>
                <div className="cell">
                  <h3 className="title is-5">Madre</h3>
                  <ul>
                    <li><strong className="has-text-primary-dark">Nombre:</strong> {applicant.madre?.nombresApellidos?.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Identificación:</strong> {applicant.madre?.numeroIdentificacion?.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Profesión:</strong> {applicant.madre?.profesion?.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Empresa:</strong> {applicant.madre?.empresa?.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Dirección:</strong> {applicant.madre?.direccion?.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Barrio:</strong> {applicant.madre?.barrio?.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Teléfono:</strong> {applicant.madre?.telefono?.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Email:</strong> {applicant.madre?.email?.toUpperCase()}</li>
                  </ul>
                </div>
                <div className="cell">
                  <h3 className="title is-5">Padre</h3>
                  <ul>
                    <li><strong className="has-text-primary-dark">Nombre:</strong> {applicant.padre?.nombresApellidos?.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Identificación:</strong> {applicant.padre?.numeroIdentificacion?.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Profesión:</strong> {applicant.padre?.profesion?.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Empresa:</strong> {applicant.padre?.empresa?.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Dirección:</strong> {applicant.padre?.direccion?.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Barrio:</strong> {applicant.padre?.barrio?.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Teléfono:</strong> {applicant.padre?.telefono?.toUpperCase()}</li>
                    <li><strong className="has-text-primary-dark">Email:</strong> {applicant.padre?.email?.toUpperCase()}</li>
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
