import type { DocumentoKeys, Matricula } from '../store/slice';

type Props = {
  value: Matricula;
  onToggle: (key: DocumentoKeys, val: boolean) => void;
};

const LABELS: Record<DocumentoKeys, string> = {
  copiaReg:'Copia Registro Civil',
  certMedico:'Certificado Médico',
  certEstudios:'Certificado de Estudios',
  carnetVacunas:'Carné de Vacunas',
  fotos3:'3 Fotos',
  certEPS:'Certificado EPS',
  certLaboral:'Certificación Laboral',
  retiroSimat:'Retiro SIMAT',
  fotoFamiliarPre:'Foto Familiar Pre',
  contratosPagare:'Contratos y Pagaré',
  pagoMatriculaYCupo:'Pago Matrícula y Cupo',
};

export default function ChecklistDocumentos({ value, onToggle }: Props) {
  return (
    <div className="content">
      {Object.keys(LABELS).map((k) => {
        const key = k as DocumentoKeys;
        const checked = !!value.documentos[key];
        return (
          <label key={k} className="checkbox" style={{ display: 'block', marginBottom: 8 }}>
            <input
              type="checkbox"
              className="mr-2"
              checked={checked}
              onChange={e => onToggle(key, e.target.checked)}
              aria-label={LABELS[key]}
            /> {LABELS[key]}
          </label>
        );
      })}
    </div>
  );
}
