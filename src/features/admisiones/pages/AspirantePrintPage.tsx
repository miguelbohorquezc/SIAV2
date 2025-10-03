import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectById } from '@/features/admisiones/store/selectors';
import { fetchApplicantsPage, printFicha } from '@/features/admisiones/store/thunks';
import { applicantsService } from '@/features/admisiones/services/applicants.service';
import logo from '@/assets/Logo-img.png'
import '@/features/admisiones/styles/admisiones.light.css'

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
    <section className="section users-scope print-section">
      <div className="box">
        <p className="subtitle">{applicant.nombresApellidos}</p>
        
        <div className="content grid ">
          <div className='cell is-col-span-10 '>
              <table className="table is-bordered is-fullwidth has-background-white">
                <colgroup>
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "40%" }} />
                  <col style={{ width: "30%" }} />
                </colgroup>
                <tbody>
                  <tr>
                    <td align='center' className='has-text-centered is-vcentered'>
                      <figure className="image is-120x120">
                        <img src={logo} />
                      </figure>
                    </td>
                    <td colSpan={2} className='has-text-centered is-vcentered'>
                      <strong className="has-text-primary-dark has-text-weight-bold is-size-5">COLINA CAMPESTRE SCHOOL</strong>
                      <p className="has-text-primary-dark has-text-weight-bold is-size-7 mb-1 ">PRESCHOOL - PRIMARY - SECONDARY</p>
                      <div>
                        <p className="has-text-primary-dark has-text-weight-semibold is-size-7 ">
                          Las suscritas rectora y secretaria del CENTRO EDUCATIVO COLINA CAMPESTRE SCHOOL de Sincelejo, Sucre,
                          con reconocimiento oficial en los niveles de Preescolar- Básica Primaria y Básica Secundaria por parte de
                          Secretaría de Educación Municipal, según resolución No 2747 del 12 de diciembre del 2023.
                          </p>
                      </div>
                    </td>
                    <td className='has-text-centered is-vcentered'>
                      <p className="has-text-primary-dark has-text-weight-semibold is-size-7 mb-1">CÓDIGO DANE: 370001038852</p>
                      <p className="has-text-primary-dark has-text-weight-semibold is-size-7 ">NIT: 901.731.191-3</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            
              <table className="table is-bordered is-fullwidth has-background-white">
                <thead className="has-background-light">
                  <tr>
                    <th align='center'>
                      <p className="has-text-primary-dark">FORMATO DE INSCRIPCIÓN</p>
                    </th>
                  </tr>
                </thead>
              </table>

              <span className="tag is-info is-light mb-4 mr-2">Código de inscripción:<strong className='has-text-weight-bold has-text-black pl-1'>{applicant.id}</strong></span>
              <span className="tag is-info is-light mb-4">Fecha de inscripción:<strong className='has-text-weight-bold has-text-black pl-1'>{new Date(applicant.createdAt).toLocaleString()}</strong></span>
              

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
                      <strong className="has-text-primary-dark">Religión:</strong>
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
                      <strong className="has-text-primary-dark">Profesión u oficio:</strong>
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
                      <strong className="has-text-primary-dark">Profesión u oficio:</strong>
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

              <table className="table is-bordered is-fullwidth has-background-white">
                <colgroup>
                  <col style={{ width: "50%" }} />
                  <col style={{ width: "50%" }} />
                </colgroup>

                <thead className="has-background-light">
                  <tr>
                    <th colSpan={4} align='center'>
                      <p className="has-text-primary-dark">FIRMA DE LOS PADRES O ACUDIENTES</p>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* Fila 1 */}
                  <tr>
                    <td align='center'>
                      <hr className='mb-1 mt-6' />
                      <strong className="has-text-primary-dark">firma del padre</strong>
                    </td>
                    <td align='center'>
                       <hr className='mb-1 mt-6' />
                      <strong className="has-text-primary-dark">firma de la madre</strong>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="table is-bordered is-fullwidth has-background-white">
                <tbody>
                  {/* Fila 1 */}
                  <tr>
                    <td colSpan={2} className='has-text-centered is-vcentered'>
                      <p className="has-text-primary-dark has-text-weight-bold is-size-7 mt-1 mb-3 ">SEDE ADMINISTRATIVA</p>
                      <div>
                          <p className="has-text-primary-dark has-text-weight-semibold is-size-7 mb-1 ">
                            Cra 34 No 38-158 Carretera troncal Vía Corozal - Teléfonos: 3006781806
                          </p>
                          <p className="has-text-primary-dark has-text-weight-semibold is-size-7 ">
                            Email: colinacampestregarabatoschool@gmail.com
                          </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>
        </div>
        <button className="button is-primary" onClick={() => window.print()}>Imprimir</button>
      </div>
    </section>
  );
}
