import { Link } from 'react-router-dom';
import type { Matricula } from '../store/slice';

type Props = {
  items: Matricula[];
};

export default function MatriculasTable({ items }: Props) {
  return (
    <table className="table is-striped is-fullwidth">
      <thead>
        <tr>
          <th>identificación</th>
          <th>Año</th>
          <th>Estado</th>
          <th>Grado</th>
          <th>Estudiante</th>
          <th>Documento</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map(m => (
          <tr key={m.id}>
            <td>{m.id}</td>
            <td>{m.anio}</td>
            <td>
              <span className={`tag is-${m.estado === 'matriculado' ? 'success' : m.estado === 'revocado' || m.estado === 'retirado' ? 'danger' : 'warning'}`}>
                {m.estado}
              </span>
            </td>
            <td>{m.gradoAspira}</td>
            <td>{m.estudiante.nombres} {m.estudiante.apellidos}</td>
            <td>{m.verificacion.tipoId}-{m.verificacion.numeroId}</td>
            <td className="has-text-right">
              <Link className="button is-small is-warning" to={`/admin/matriculas/${m.id}`}>
                <i className="fa-solid fa-eye mr-2"></i>
                <p>Ver</p>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
