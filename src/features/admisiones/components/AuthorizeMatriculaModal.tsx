import { useState } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function AuthorizeMatriculaModal({ isOpen, onClose, onConfirm }: Props) {
  const [confirmText, setConfirmText] = useState('');
  if (!isOpen) return null;
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Autorizar matrícula</p>
          <button className="delete" aria-label="close" onClick={onClose} />
        </header>
        <section className="modal-card-body has-background-white">
          <p className='has-text-dark'>Escribe <strong className='has-text-success has-text-weight-bold'>CONFIRMAR</strong> para autorizar la matrícula.</p>
          <input className="input mt-3" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
        </section>
        <footer className="modal-card-foot">
          <button
            className="button is-success mr-2 has-text-white"
            disabled={confirmText !== 'CONFIRMAR'}
            onClick={onConfirm}
          >
            Confirmar
          </button>
          <button className="button" onClick={onClose}>Cancelar</button>
        </footer>
      </div>
    </div>
  );
}
