import { useState } from 'react';

type Props = { onConfirm: (reason: string) => void; };
export default function RetirarButton({ onConfirm }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  return (
    <>
      <button className="button is-warning is-light" onClick={() => setOpen(true)} aria-label="Marcar retirado">Retirar</button>
      {open && (
        <div className="modal is-active" role="dialog" aria-modal="true" aria-label="Confirmar retiro">
          <div className="modal-background" onClick={() => setOpen(false)} />
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Marcar como retirado</p>
              <button className="delete" aria-label="close" onClick={() => setOpen(false)} />
            </header>
            <section className="modal-card-body">
              <div className="field">
                <label className="label">Motivo</label>
                <div className="control">
                  <textarea className="textarea" value={reason} onChange={e => setReason(e.target.value)} aria-label="Motivo de retiro" />
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-warning" onClick={() => { onConfirm(reason); setOpen(false); }}>Confirmar</button>
              <button className="button" onClick={() => setOpen(false)}>Cancelar</button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
