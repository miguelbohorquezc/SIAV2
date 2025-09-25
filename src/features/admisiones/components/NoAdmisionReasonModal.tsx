import React, { useState, useEffect } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title?: string;          // NUEVO: título personalizable
  confirmLabel?: string;   // NUEVO: etiqueta del botón confirmar
  required?: boolean;      // NUEVO: si el motivo es obligatorio (default true)
  placeholder?: string;    // NUEVO: placeholder del textarea
};

export default function NoAdmisionReasonModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Motivo de no admisión',
  confirmLabel = 'Confirmar',
  required = true,
  placeholder = 'Describa el motivo...',
}: Props) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!isOpen) setReason('');
  }, [isOpen]);

  if (!isOpen) return null;

  const canConfirm = required ? reason.trim().length > 0 : true;

  return (
    <div className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button className="delete" aria-label="close" onClick={onClose}></button>
        </header>
        <section className="modal-card-body has-background-white">
          <div className="field">
            <label className="label">Motivo {required ? '(obligatorio)' : '(opcional)'}</label>
            <div className="control">
              <textarea
                className="textarea is-danger"
                placeholder={placeholder}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            {required && reason.trim().length === 0 && (
              <p className="help is-danger">El motivo es obligatorio.</p>
            )}
          </div>
        </section>
        <footer className="modal-card-foot">
          <button
            className="button is-danger mr-2 has-text-white"
            disabled={!canConfirm}
            onClick={() => onConfirm(reason.trim())}
          >
            {confirmLabel}
          </button>
          <button className="button" onClick={onClose}>Cancelar</button>
        </footer>
      </div>
    </div>
  );
}
