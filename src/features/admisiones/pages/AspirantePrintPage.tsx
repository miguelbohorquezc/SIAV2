import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectById } from '@/features/admisiones/store/selectors';
import { fetchApplicantsPage, printFicha } from '@/features/admisiones/store/thunks';
import { applicantsService } from '@/features/admisiones/services/applicants.service';

/**
 * AspirantePrintPage
 * - Muestra la **ficha completa** del aspirante (todos los campos relevantes).
 * - Si no está en Redux, intenta cargar página y luego fallback puntual por id.
 * - Llama a `printFicha` para registrar auditoría de impresión.
 */
export default function AspirantePrintPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const applicant = useSelector(selectById(id ?? ''));

  useEffect(() => {
    (async () => {
      if (!id) return;
      if (!applicant) {
        await (dispatch(fetchApplicantsPage(undefined) as any) as any);
      }
      // Fallback puntual si aún no existe
      if (!applicant) {
        await applicantsService.getById(id);
      }
      // Registrar auditoría print (no bloquea)
      await (dispatch(printFicha({ id }) as any) as any);
    })();
  }, [dispatch, id]); // deliberately not depending on applicant to avoid loops

  if (!applicant) {
    return (
      <div className="section">
        <progress className="progress is-primary" max={100} />
      </div>
    );
  }

  return (
    <section className="section">
      <div className="box">
        <h1 className="title">Ficha del aspirante</h1>
        <p className="subtitle">{applicant.nombresApellidos}</p>
        <hr />
        <div className="content">
          <h3 className="title is-5">Datos generales</h3>
          <ul>
            <li><strong>Identificación:</strong> {applicant.numeroIdentificacion}</li>
            <li><strong>Sexo:</strong> {applicant.sexo}</li>
            <li><strong>Fecha Nacimiento:</strong> {applicant.fechaNacimiento}</li>
            <li><strong>Lugar Nacimiento:</strong> {applicant.lugarNacimiento}</li>
            <li><strong>Dirección:</strong> {applicant.direccionResidencia}</li>
            <li><strong>Barrio:</strong> {applicant.barrioAspirante}</li>
            <li><strong>Teléfono:</strong> {applicant.telefono}</li>
            <li><strong>Teléfono Casa:</strong> {applicant.telefonoCasa}</li>
            <li><strong>Colegio Procedencia:</strong> {applicant.colegioProcedencia}</li>
            <li><strong>Último Grado:</strong> {applicant.ultimoGrado}</li>
            <li><strong>Religión:</strong> {applicant.religion}</li>
            <li><strong>Familiares en colegio:</strong> {applicant.familiaresEnColegio}</li>
            <li><strong>Estado:</strong> {applicant.estado}</li>
            <li><strong>Motivo No Admisión:</strong> {applicant.motivoNoAdmision ?? '—'}</li>
            <li><strong>Autorizado matrícula:</strong> {applicant.autorizadoMatricula ? 'Sí' : 'No'}</li>
            <li><strong>Autorizado por:</strong> {applicant.autorizadoBy ?? '—'}</li>
            <li><strong>Autorizado el:</strong> {applicant.autorizadoAt ? new Date(applicant.autorizadoAt).toLocaleString() : '—'}</li>
            <li><strong>Fuente:</strong> {applicant.fuente}</li>
            <li><strong>Tags:</strong> {applicant.tags.join(', ')}</li>
            <li><strong>Creado:</strong> {new Date(applicant.createdAt).toLocaleString()}</li>
            <li><strong>Actualizado:</strong> {new Date(applicant.updatedAt).toLocaleString()}</li>
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

        <button className="button is-primary" onClick={() => window.print()}>Imprimir</button>
      </div>
    </section>
  );
}
