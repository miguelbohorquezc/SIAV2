import type { Matricula } from '../store/slice';
import logo from '@/assets/Logo-img.png'
import '@/features/admin-matricula/styles/adminMatricula.light.css'

export default function Ficha({ data }: { data: Matricula }) {
  return (
      <section className="section users-scope .print-section-matricula">
            <div className="box">
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
      
                    <span className="tag is-info is-light mb-4 mr-2">Código de inscripción:<strong className='has-text-weight-bold has-text-black pl-1'>{data.id}</strong></span>
                    <span className="tag is-info is-light mb-4">Fecha de matrícula:<strong className='has-text-weight-bold has-text-black pl-1'>
                      {
                      //@ts-ignore  
                      new Date(data.createdAt).toLocaleString()}</strong></span>
                    <span className="tag is-success is-light ml-2 mb-4">Estado:<strong className='has-text-weight-bold has-text-black pl-1'>{data.estado}</strong></span>
                    <span className="tag is-success is-light ml-2 mb-4">Ciclo:<strong className='has-text-weight-bold has-text-black pl-1'>{data.anio}</strong></span>      

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
                            <p className="has-text-primary-dark">{data.verificacion.tipoId.toUpperCase()}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Número de identificación:</strong>
                            <p className="has-text-primary-dark">{data.verificacion.numeroId.toUpperCase()}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Nombres:</strong>
                            <p className="has-text-primary-dark">{data.estudiante.nombres.toUpperCase()}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Apellidos:</strong>
                            <p className="has-text-primary-dark">{data.estudiante.apellidos.toUpperCase()}</p>
                          </td>
                        </tr>
      
                        {/* Fila 2 */}
                        <tr>
                          <td>
                            <strong className="has-text-primary-dark">Fecha nacimiento:</strong>
                            <p className="has-text-primary-dark">{data.estudiante.fechaNacimiento}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Lugar de nacimiento:</strong>
                            <p className="has-text-primary-dark">{data.estudiante.lugarNacimiento?.toUpperCase()}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Sexo:</strong>
                            <p className="has-text-primary-dark">{data.estudiante.sexo}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Edad:</strong>
                            <p className="has-text-primary-dark">
                              {`${data.estudiante.edadAnios} año(s) - ${data.estudiante.edadMeses} meses`}
                            </p>
                          </td>
                        </tr>
      
                        {/* Fila 3 → aquí ampliamos celdas */}
                        <tr>
                          <td colSpan={1}>
                            <strong className="has-text-primary-dark">Dirección de residencia:</strong>
                            <p className="has-text-primary-dark">{data.estudiante.direccion?.toUpperCase()}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Barrio:</strong>
                            <p className="has-text-primary-dark">{data.estudiante.barrio?.toUpperCase()}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Teléfono:</strong>
                            <p className="has-text-primary-dark">{data.estudiante.telefono? data.estudiante.telefono :'No registra'}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Religión:</strong>
                            <p className="has-text-primary-dark">{data.estudiante.religion}</p>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <strong className="has-text-primary-dark">Grado al que aspira:</strong>
                            <p className="has-text-primary-dark">{data.gradoAspira.toUpperCase()}</p>
                          </td>
                          <td colSpan={2}>
                            <strong className="has-text-primary-dark">Colego Procedencia:</strong>
                            <p className="has-text-primary-dark">{data.estudiante.colegioAnterior?.toUpperCase()}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Último grado cursado:</strong>
                              <p className="has-text-primary-dark">{data.estudiante.ultimoGrado?.toUpperCase()}</p>
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
                            <p className="has-text-primary-dark">{data.padre.numeroIdentificacion}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Nombres y apellidos:</strong>
                            <p className="has-text-primary-dark">{`${data.padre.nombres} ${data.padre.apellidos} `}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Dirección:</strong>
                            <p className="has-text-primary-dark">{data.padre.direccion}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Ciudad:</strong>
                            <p className="has-text-primary-dark">{data.padre.ciudad.toUpperCase()}</p>
                          </td>
                        </tr>
      
                        {/* Fila 2 */}
                        <tr>
                          <td>
                            <strong className="has-text-primary-dark">Empresa donde trabaja:</strong>
                            <p className="has-text-primary-dark">{data.padre.empresa}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Email:</strong>
                            <p className="has-text-primary-dark">{data.padre.email}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Profesión u oficio:</strong>
                            <p className="has-text-primary-dark">{data.padre.cargo.toUpperCase()}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Teléfono:</strong>
                            <p className="has-text-primary-dark">
                              {data.padre.telefono}
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
                            <p className="has-text-primary-dark">{data.madre.numeroIdentificacion}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Nombres y apellidos:</strong>
                            <p className="has-text-primary-dark">{`${data.madre.nombres} ${data.madre.apellidos} `}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Dirección:</strong>
                            <p className="has-text-primary-dark">{data.madre.direccion}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Ciudad:</strong>
                            <p className="has-text-primary-dark">{data.madre.ciudad.toUpperCase()}</p>
                          </td>
                        </tr>
      
                        {/* Fila 2 */}
                        <tr>
                          <td>
                            <strong className="has-text-primary-dark">Empresa donde trabaja:</strong>
                            <p className="has-text-primary-dark">{data.madre.empresa}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Email:</strong>
                            <p className="has-text-primary-dark">{data.madre.email}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Profesión u oficio:</strong>
                            <p className="has-text-primary-dark">{data.madre.cargo?.toUpperCase()}</p>
                          </td>
                          <td>
                            <strong className="has-text-primary-dark">Teléfono:</strong>
                            <p className="has-text-primary-dark">
                              {data.madre.telefono}
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
                            <p className="has-text-primary-dark">¿QUIÉN ASUME LOS COSTOS EDUCATIVOS?</p>
                          </th>
                        </tr>
                      </thead>
      
                      <tbody>
                        {/* Fila 1 */}
                        <tr>
                          <td colSpan={2}>
                            <strong className="has-text-primary-dark">Nombres y apellidos:</strong>
                            <p className="has-text-primary-dark">{data.responsable.quienAsumeCostos}</p>
                          </td>
                          <td colSpan={2}>
                            <strong className="has-text-primary-dark">Compromiso de pago los primeros 10 dias de cada mes:</strong>
                            <p className="has-text-primary-dark">{data.responsable.seComprometePrimeros10Dias? 'SI':'NO'}</p>
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
                            <p className="has-text-primary-dark">NOTA</p>
                          </th>
                        </tr>
                      </thead>
      
                      <tbody>
                        {/* Fila 1 */}
                        <tr>
                          <td colSpan={4}>
                            <strong className="has-text-primary-dark"></strong>
                            <p className="has-text-primary-dark">
                              ESTÁN DISPUESTOS A APOYAR LAS ACCIONES EDUCATIVAS QUE ADELANTA 
                              ESTA INSTITUCIÓN, CONOCER, Y   APROPIARSE DEL MANUAL DE CONVIVENCIA, Y D
                              EL PROYECTO EDUCATIVO INSTITUCIONAL, ACATANDO LAS NORMAS ESTABLECIDAS. SI ____, NO____.
                              ESTE MANUAL APLICA PARA TODAS LAS PERSONAS VINCULADAS AL CENTRO EDUCATIVO COLINA CAMPESTRE GARABATOS SCHOOL. 
                              </p>
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
                            <p className="has-text-primary-dark">FIRMA DE LOS PADRES, ACUDIENTE Y ESTUDIANTE</p>
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
                        <tr>
                          <td align='center'>
                            <hr className='mb-1 mt-6' />
                            <strong className="has-text-primary-dark">firma del acudiente</strong>
                          </td>
                          <td align='center'>
                            <hr className='mb-1 mt-6' />
                            <strong className="has-text-primary-dark">firma del estudiante</strong>
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
