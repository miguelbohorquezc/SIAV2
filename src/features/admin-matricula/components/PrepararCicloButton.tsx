import { useMemo, useState } from 'react';
import ConfirmModal from './ConfirmModal';

type Props = {
  currentYear: number;
  busy?: boolean;
  onPrepare: (anioNuevo: number) => Promise<{ created: number; skipped: number }>;
};

export default function PrepararCicloButton({ currentYear, busy, onPrepare }: Props) {
  const [open, setOpen] = useState(false);
  const [anioNuevo, setAnioNuevo] = useState<number>(currentYear + 1);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ created: number; skipped: number } | null>(null);
  const [toast, setToast] = useState<{ type: 'is-success' | 'is-danger'; msg: string } | null>(null);

  const message = useMemo(() => {
    return (
      `Se crearán documentos de matrícula para el año ${anioNuevo} ` +
      `a partir de los registros del año ${anioNuevo - 1}, reseteando el checklist. ` +
      `¿Deseas continuar?`
    );
  }, [anioNuevo]);

  const onConfirm = async () => {
    setSaving(true);
    try {
      const summary = await onPrepare(anioNuevo);
      setResult(summary);
      setToast({ type: 'is-success', msg: `Ciclo preparado: ${summary.created} creados, ${summary.skipped} omitidos.` });
    } catch (e: any) {
      setToast({ type: 'is-danger', msg: e?.message ?? 'No se pudo preparar el ciclo.' });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 2800);
      setOpen(false);
    }
  };

  return (
    <>
      {toast && <div className={`notification ${toast.type}`} role="status">{toast.msg}</div>}

      {result && (
        <article className="message is-link">
          <div className="message-body">
            <strong>Renovación anual lista:</strong> {result.created} creados, {result.skipped} omitidos.
          </div>
        </article>
      )}

      <div className="field has-addons">
        <div className="control">
          <input
            className="input"
            type="number"
            min={currentYear}
            value={anioNuevo}
            aria-label="Año nuevo"
            onChange={(e) => setAnioNuevo(Number(e.target.value || currentYear + 1))}
            style={{ width: 120 }}
          />
        </div>
        <div className="control">
          <button
            className={`button is-warning ${saving || busy ? 'is-loading' : ''}`}
            onClick={() => setOpen(true)}
            disabled={saving || busy}
            aria-label="Preparar ciclo"
          >
            Preparar ciclo
          </button>
        </div>
      </div>

      <ConfirmModal
        open={open}
        title="Confirmar preparación de ciclo"
        message={message}
        confirmLabel="Sí, preparar"
        cancelLabel="Cancelar"
        onConfirm={onConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
