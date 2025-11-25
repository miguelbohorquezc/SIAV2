import { useState } from 'react';

type Props = { onConfirm: (reason: string) => void; };
export default function RevocarButton({ onConfirm }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  return (
    <>
      <button className="button is-danger is-light" onClick={() => setOpen(true)} aria-label="Revocar matrícula">Revocar</button>
      {open && (
        <div className="modal is-active" role="dialog" aria-modal="true" aria-label="Confirmar revocatoria">
          <div className="modal-background" onClick={() => setOpen(false)} />
          <div className="modal-card">
            <header className="modal-card-head has-background-white">
              <h2 className="modal-card-title has-text-black">Revocar la matrícula</h2>
              
              <button className="delete" aria-label="close" onClick={() => setOpen(false)} />
            </header>
            <section className="modal-card-body has-background-white">
              <div className="field">
                <label className="label">Motivo</label>
                <div className="control">
                  <textarea className="textarea" value={reason} onChange={e => setReason(e.target.value)} aria-label="Motivo de revocatoria" />
                </div>
              </div>
            </section>
            <footer className="modal-card-foot has-background-white">
              <button className="button is-danger mr-2" onClick={() => { onConfirm(reason); setOpen(false); }}>Confirmar</button>
              <button className="button is-danger is-light" onClick={() => setOpen(false)}>Cancelar</button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
