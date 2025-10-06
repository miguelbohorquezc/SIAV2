import type { Matricula } from '../store/slice';

type Props = {
  value: Matricula;
  onChange: (patch: Partial<Matricula>) => void;
  onSave: () => void;
};

export default function MatriculaForm({ value, onChange, onSave }: Props) {
  const s = value.estudiante || ({} as any);
  return (
    <div className="box">
      <div className="field">
        <label className="label">Nombres</label>
        <div className="control">
          <input className="input" value={s.nombres || ''} onChange={e => onChange({ estudiante: { ...s, nombres: e.target.value } as any })} aria-label="Nombres del estudiante" />
        </div>
      </div>
      <div className="field">
        <label className="label">Apellidos</label>
        <div className="control">
          <input className="input" value={s.apellidos || ''} onChange={e => onChange({ estudiante: { ...s, apellidos: e.target.value } as any })} aria-label="Apellidos del estudiante" />
        </div>
      </div>
      <div className="field is-grouped">
        <div className="control">
          <button className="button is-primary" onClick={onSave} aria-label="Guardar cambios">Guardar</button>
        </div>
      </div>
    </div>
  );
}
