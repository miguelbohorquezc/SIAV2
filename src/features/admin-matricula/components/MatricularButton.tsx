type Props = { enabled: boolean; onConfirm: () => void; };
export default function MatricularButton({ enabled, onConfirm }: Props) {
  return (
    <button className="button is-success" disabled={!enabled} onClick={onConfirm} aria-label="Confirmar matrícula">
      Matricular
    </button>
  );
}
