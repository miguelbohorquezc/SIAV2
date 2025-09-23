type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

import { useState } from 'react';

export default function NoAdmisionReasonModal({ isOpen, onClose, onConfirm }: Props) {
  const [reason, setReason] = useState('');
  if (!isOpen) return null;
  const valid = reason.trim().length >= 5;

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Motivo de no admisión</p>
          <button className="delete" aria-label="close" onClick={onClose} />
        </header>
        <section className="modal-card-body">
          <textarea
            className="textarea"
            placeholder="Describe brevemente el motivo…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </section>
        <footer className="modal-card-foot">
          <button className="button is-danger" disabled={!valid} onClick={() => onConfirm(reason)}>
            Guardar motivo
          </button>
          <button className="button" onClick={onClose}>Cancelar</button>
        </footer>
      </div>
    </div>
  );
}
