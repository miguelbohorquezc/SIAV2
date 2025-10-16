import type { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectForm } from '../store/selector';

const Row = ({ k, v }: { k: string; v: string | number | boolean | undefined }) => (
  <tr><th className="has-text-black">{k}</th><td><p className="has-text-black">{String(v ?? '')}</p></td></tr>
);

const StepResumen: FC = () => {
  const { verificacion, estudiante, madre, padre, responsable } = useSelector(selectForm);
  return (
    <div className="table-container">
      <table className="table is-striped is-fullwidth ">
        <tbody>
          <Row k="Tipo ID" v={verificacion.tipoId.toUpperCase()} />
          <Row k="Número ID" v={verificacion.numeroId.toUpperCase()} />
          <Row k="Grado" v={estudiante.gradoAspira ? estudiante.gradoAspira.toUpperCase() : ''} />
          <Row k="Estudiante" v={`${(estudiante.nombres?.toUpperCase() ?? '')} ${(estudiante.apellidos?.toUpperCase() ?? '')}`} />
          <Row k="Madre" v={`${(madre.nombres?.toUpperCase() ?? '')} ${(madre.apellidos?.toUpperCase() ?? '')}`} />
          <Row k="Padre" v={`${(padre.nombres?.toUpperCase() ?? '')} ${(padre.apellidos?.toUpperCase() ?? '')}`} />
          <Row k="Responsable" v={responsable.quienAsumeCostos?.toUpperCase() ?? ''} />
        </tbody>
      </table>
    </div>
  );
};

export default StepResumen;
