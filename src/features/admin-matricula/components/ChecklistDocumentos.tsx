import { useMemo, useState } from 'react';
import type { Matricula } from '../store/slice';
import ConfirmModal from './ConfirmModal';
import { REQUIRED_DOC_KEYS, isChecklistCompleto } from '../utils/checks';

type Props = {
  value: Matricula;
  onToggle: (key: keyof Matricula['documentos'], val: boolean) => void | Promise<void>;
};

type DocItem = { key: keyof Matricula['documentos']; label: string; required?: boolean };

/** Fuente única: REQUIRED_DOC_KEYS controla qué es requerido */
const DOCS: DocItem[] = [
  { key: 'copiaReg', label: 'Copia Registro Civil', required: REQUIRED_DOC_KEYS.includes('copiaReg') },
  { key: 'certMedico', label: 'Certificado Médico', required: REQUIRED_DOC_KEYS.includes('certMedico') },
  { key: 'certEstudios', label: 'Certificado de Estudios', required: REQUIRED_DOC_KEYS.includes('certEstudios') },
  { key: 'carnetVacunas', label: 'Carné de Vacunas', required: REQUIRED_DOC_KEYS.includes('carnetVacunas') },
  { key: 'fotos3', label: '3 Fotos', required: REQUIRED_DOC_KEYS.includes('fotos3') },
  { key: 'certEPS', label: 'Certificado EPS', required: REQUIRED_DOC_KEYS.includes('certEPS') },
  { key: 'certLaboral', label: 'Certificado Laboral (acudiente)', required: REQUIRED_DOC_KEYS.includes('certLaboral') },
  { key: 'retiroSimat', label: 'Retiro SIMAT', required: REQUIRED_DOC_KEYS.includes('retiroSimat') },
  { key: 'fotoFamiliarPre', label: 'Foto Familiar (Preescolar)', required: REQUIRED_DOC_KEYS.includes('fotoFamiliarPre') },
  { key: 'contratosPagare', label: 'Contratos y Pagaré', required: REQUIRED_DOC_KEYS.includes('contratosPagare') },
  { key: 'pagoMatriculaYCupo', label: 'Pago Matrícula y Cupo', required: REQUIRED_DOC_KEYS.includes('pagoMatriculaYCupo') },
];

export default function ChecklistDocumentos({ value, onToggle }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingKey, setPendingKey] = useState<keyof Matricula['documentos'] | null>(null);
  const [pendingVal, setPendingVal] = useState<boolean>(false);
  const [toast, setToast] = useState<{ type: 'is-success' | 'is-danger'; msg: string } | null>(null);

  const completos = useMemo(() => isChecklistCompleto(value), [value]);

  const openConfirm = (key: keyof Matricula['documentos'], newVal: boolean) => {
    setPendingKey(key);
    setPendingVal(newVal);
    setConfirmOpen(true);
  };

  const onConfirm = async () => {
    if (!pendingKey) return;
    setConfirmOpen(false);
    try {
      await onToggle(pendingKey, pendingVal);
      setToast({ type: 'is-success', msg: `Se ${pendingVal ? 'marcó' : 'desmarcó'} "${labelOf(pendingKey)}".` });
    } catch (e: any) {
      setToast({ type: 'is-danger', msg: e?.message ?? 'No se pudo actualizar el documento.' });
    } finally {
      setPendingKey(null);
      setTimeout(() => setToast(null), 2000);
    }
  };

  const onCancel = () => {
    setConfirmOpen(false);
    setPendingKey(null);
  };

  const labelOf = (k: keyof Matricula['documentos']) => DOCS.find(d => d.key === k)?.label ?? String(k);

  const toggleAllRequired = async (target: boolean) => {
    setPendingKey('completo');
    setPendingVal(target);
    setConfirmOpen(true);
  };

  const confirmText = useMemo(() => {
    if (pendingKey === 'completo') {
      return pendingVal
        ? 'Se marcarán como COMPLETOS todos los documentos requeridos. ¿Confirmas?'
        : 'Se desmarcarán todos los documentos requeridos. ¿Confirmas?';
    }
    const lbl = pendingKey ? labelOf(pendingKey) : '';
    return pendingVal
      ? `¿Confirmas marcar "${lbl}" como entregado/verificado?`
      : `¿Confirmas desmarcar "${lbl}"?`;
  }, [pendingKey, pendingVal]);

  const handleConfirmSpecial = async () => {
    if (pendingKey !== 'completo') return onConfirm();
    setConfirmOpen(false);
    try {
      for (const k of REQUIRED_DOC_KEYS) {
        await onToggle(k, pendingVal);
      }
      setToast({
        type: 'is-success',
        msg: pendingVal ? 'Todos los requeridos fueron marcados.' : 'Todos los requeridos fueron desmarcados.',
      });
    } catch {
      setToast({ type: 'is-danger', msg: 'No se pudieron actualizar todos los requeridos.' });
    } finally {
      setPendingKey(null);
      setTimeout(() => setToast(null), 2000);
    }
  };

  return (
    <div>
      {toast && (
        <div className={`notification ${toast.type}`} role="status">
          {toast.msg}
        </div>
      )}

      <section className='section users-scope'>
            <div className="box">
              <div className="level">
                <div className="level-left">
                  <h2 className="title is-5">Checklist de Documentos</h2>
                </div>
                <div className="level-right">
                  <div className="buttons">
                    <button className="button is-light" onClick={() => toggleAllRequired(false)} aria-label="Desmarcar requeridos">
                      Desmarcar requeridos
                    </button>
                    <button className="button is-success" onClick={() => toggleAllRequired(true)} aria-label="Marcar requeridos">
                      Marcar requeridos
                    </button>
                  </div>
                </div>
              </div>

              <table className="table is-fullwidth is-striped">
                <thead>
                  <tr>
                    <th style={{ width: '48%' }}>Documento</th>
                    <th>Requerido</th>
                    <th>Estado</th>
                    <th className="has-text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {DOCS.map((d) => {
                    const checked = !!value.documentos[d.key];
                    return (
                      <tr key={d.key as string}>
                        <td>
                          <label className="label" htmlFor={`doc-${String(d.key)}`}>{d.label}</label>
                          {d.required && <span className="tag is-danger has-text-white" style={{ marginLeft: 8 }}>Requerido</span>}
                        </td>
                        <td><p className='has-text-dark'>{d.required ? 'Sí' : 'No'}</p></td>
                        <td>
                          {checked ? <span className="tag is-success has-text-white">Marcado</span> : <span className="tag is-danger has-text-white">Pendiente</span>}
                        </td>
                        <td className="has-text-right">
                          <div className="buttons is-right">
                            <button
                              id={`doc-${String(d.key)}`}
                              className={`button ${checked ? '' : 'is-info'}`}
                              onClick={() => openConfirm(d.key, !checked)}
                              aria-label={`${checked ? 'Desmarcar' : 'Marcar'} ${d.label}`}
                            >
                              {checked ? 'Desmarcar' : 'Marcar'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4}>
                      <article className="message  is-info">
                        <div className="message-body has-background-info-light">
                          <strong>Estado general:</strong>{' '}
                          {completos ? 'Todos los documentos requeridos están marcados.' : 'Faltan documentos requeridos.'}
                        </div>
                      </article>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
      </section>

      <ConfirmModal
        open={confirmOpen}
        title="Confirmar cambio"
        message={confirmText}
        confirmLabel="Sí, confirmar"
        cancelLabel="Cancelar"
        onConfirm={pendingKey === 'completo' ? handleConfirmSpecial : onConfirm}
        onCancel={onCancel}
      />
    </div>
  );
}
