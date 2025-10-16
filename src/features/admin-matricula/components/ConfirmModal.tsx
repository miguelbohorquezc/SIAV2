import React from 'react';

type Props = {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className={`modal ${open ? 'is-active' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal-background" onClick={onCancel} />
      <div className="modal-card">
        <header className="modal-card-head has-background-white">
          <p className="modal-card-title has-text-black">{title}</p>
          <button className="delete" aria-label="close" onClick={onCancel} />
        </header>
        {message && (
          <section className="modal-card-body has-background-white">
            <p>{message}</p>
          </section>
        )}
        <footer className="modal-card-foot has-background-white">
          <button className="button is-success mr-2" onClick={onConfirm} aria-label={confirmLabel}>
            {confirmLabel}
          </button>
          <button className="button is-info is-light" onClick={onCancel} aria-label={cancelLabel}>
            {cancelLabel}
          </button>
        </footer>
      </div>
    </div>
  );
}
