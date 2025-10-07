import { Link } from 'react-router-dom';
import type { Matricula } from '../store/slice';

type Props = {
  items: Matricula[];
};

export default function MatriculasTable({ items }: Props) {
  return (
    <table className="table is-bordered is-fullwidth has-background-white ">
      <thead>
        <tr>
          <th>Documentos físicos</th>
          <th>Año</th>
          <th>Estado</th>
          <th>Grado</th>
          <th>Estudiante</th>
          <th>Documento</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {items.map(m => (
          <tr key={m.id}>
            <td>
              <ul>
                <li>
                  <span className={`tag is-${m.documentos.carnetVacunas? 'tag is-success' : 'danger '}`}>
                    <i className="fa-solid fa-file mr-1 has-text-white"></i>
                    <p className='has-text-white'>{m.documentos.carnetVacunas?'Carnet Vacunas: listo':'Carnet Vacunas: Pendiente'}</p>
                  </span>
                </li>
                <li>
                  <span className={`tag is-${m.documentos.copiaReg? 'tag is-success' : 'danger '}`}>
                    <i className="fa-solid fa-file mr-1 has-text-white"></i>
                    <p className='has-text-white'>{m.documentos.copiaReg?'Registro Civil: listo':'Registro Civil: Pendiente'}</p>
                  </span>
                </li>
                <li>
                  <span className={`tag is-${m.documentos.certMedico? 'tag is-success ' : 'danger '}`}>
                    <i className="fa-solid fa-file mr-1 has-text-white"></i>
                    <p className='has-text-white'>{m.documentos.certMedico?'Certificado Médico: listo':'Certificado Médico: Pendiente'}</p>
                  </span>
                </li>
                <li>
                  <span className={`tag is-${m.documentos.certEstudios? 'tag is-success ' : 'danger '}`}>
                    <i className="fa-solid fa-file mr-1 has-text-white"></i>
                    <p className='has-text-white'>{m.documentos.certEstudios?'Certificado de estudios: listo':'Certificado de estudios: Pendiente'}</p>
                  </span>
                </li>
                <li>
                  <span className={`tag is-${m.documentos.fotos3? 'tag is-success ' : 'danger '}`}>
                    <i className="fa-solid fa-file mr-1 has-text-white"></i>
                    <p className='has-text-white'>{m.documentos.fotos3?'3 Fotografías: listo':'3 Fotografías: Pendiente'}</p>
                  </span>
                </li>
                <li>
                  <span className={`tag is-${m.documentos.certEPS? 'tag is-success ' : 'danger '}`}>
                    <i className="fa-solid fa-file mr-1 has-text-white"></i>
                    <p className='has-text-white'>{m.documentos.certEPS?'Certificado EPS: listo':'Certificado EPS: Pendiente'}</p>
                  </span>
                </li>
                <li>
                  <span className={`tag is-${m.documentos.certLaboral? 'tag is-success ' : 'danger '}`}>
                    <i className="fa-solid fa-file mr-1 has-text-white"></i>
                    <p className='has-text-white'>{m.documentos.certLaboral?'Certificado Laboral: listo':'Certificado Laboral: Pendiente'}</p>
                  </span>
                </li>
                <li>
                  <span className={`tag is-${m.documentos.retiroSimat? 'tag is-success ' : 'danger '}`}>
                    <i className="fa-solid fa-file mr-1 has-text-white"></i>
                    <p className='has-text-white'>{m.documentos.retiroSimat?'Retiro SIMAT: listo':'Retiro SIMAT: Pendiente'}</p>
                  </span>
                </li>
                <li>
                  <span className={`tag is-${m.documentos.fotoFamiliarPre? 'tag is-success ' : 'danger '}`}>
                    <i className="fa-solid fa-file mr-1 has-text-white"></i>
                    <p className='has-text-white'>{m.documentos.fotoFamiliarPre?'Fotografía familiar: listo':'Fotografía familiar: Pendiente'}</p>
                  </span>
                </li>
                <li>
                  <span className={`tag is-${m.documentos.contratosPagare? 'tag is-success ' : 'danger '}`}>
                    <i className="fa-solid fa-file mr-1 has-text-white"></i>
                    <p className='has-text-white'>{m.documentos.contratosPagare?'Contratos y Pagaré: listo':'Contratos y Pagaré: Pendiente'}</p>
                  </span>
                </li>
                <li>
                  <span className={`tag is-${m.documentos.pagoMatriculaYCupo? 'tag is-success' : 'danger '}`}>
                    <i className="fa-solid fa-file mr-1 has-text-white"></i>
                    <p className='has-text-white'>{m.documentos.pagoMatriculaYCupo?'Matrícula y Cúpo: listo':'Matrícula y Cúpo: Pendiente'}</p>
                  </span>
                </li>
              </ul>
            </td>
            <td><p className='has-text-primary-invert'>{m.anio}</p></td>
            <td>
              <span className={`has-text-white tag is-${m.estado === 'matriculado' ? 'success' : m.estado === 'revocado' || m.estado === 'retirado' ? 'danger' : 'warning'}`}>
                <i className="fa-solid fa-circle-notch mr-1"></i>
                {m.estado}
              </span>
            </td>
            <td><p className='has-text-primary-invert'>{m.gradoAspira}</p></td>
            <td><p className='has-text-primary-invert'>{m.estudiante.nombres.toUpperCase()} {m.estudiante.apellidos.toUpperCase()}</p></td>
            <td><p className='has-text-primary-invert'>{m.verificacion.tipoId}-{m.verificacion.numeroId}</p></td>
            <td className="has-text-right">
              <Link className="button is-small is-warning" to={`/admin/matriculas/${m.id}`}>
                <i className="fa-solid fa-eye mr-2 has-text-primary-invert" ></i>
                <p className='has-text-primary-invert'>Ver</p>
              </Link>
            </td>
          </tr>
        ))}
        {items.length === 0 && (
              <tr><td colSpan={10}><em className='has-text-primary-invert'>No hay resultados con los filtros actuales.</em></td></tr>
        )}
      </tbody>
    </table>
  );
}
