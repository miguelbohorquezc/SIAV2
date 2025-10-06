import type { Matricula } from '../store/slice';

export default function Ficha({ data }: { data: Matricula }) {
  return (
    <div className="box">
      <h1 className="title is-4">Ficha de Matrícula {data.anio}</h1>
      <p><strong>Estudiante:</strong> {data.estudiante.nombres} {data.estudiante.apellidos}</p>
      <p><strong>Documento:</strong> {data.verificacion.tipoId}-{data.verificacion.numeroId}</p>
      <p><strong>Grado aspirado:</strong> {data.gradoAspira}</p>
      <p><strong>Estado:</strong> {data.estado}</p>
      <hr />
      <h2 className="title is-5">Checklist</h2>
      <ul>
        {Object.entries(data.documentos).map(([k, v]) => (
          <li key={k}>{k}: {v ? '✓' : '✗'}</li>
        ))}
      </ul>
    </div>
  );
}
