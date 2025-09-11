import { memo, useMemo, useState } from 'react';
import type { CreateUserWithPasswordInput } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (input: CreateUserWithPasswordInput) => void;
  creating?: boolean;
  error?: string;
}

function ModalCmp({ open, onClose, onCreate, creating, error }: Props) {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'DOCENTE'|'COORDINADOR'|'SECRETARIA'>('DOCENTE');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [sendInvite, setSendInvite] = useState(false);

  const canSubmit = useMemo(() => {
    return email && role && password.length >= 6 && password === confirm;
  }, [email, role, password, confirm]);

  if (!open) return null;
  return (
    <div className="modal is-active" role="dialog" aria-modal="true" aria-label="Crear usuario">
      <div className="modal-background" onClick={onClose} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Nuevo usuario</p>
          <button className="delete" onClick={onClose} aria-label="close"></button>
        </header>
        <section className="modal-card-body has-background-white">
          {error && <p className="notification is-danger" role="alert">{error}</p>}
          <div className="field">
            <label className="label">Correo</label>
            <div className="control"><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
          </div>
          <div className="field">
            <label className="label">Nombre</label>
            <div className="control"><input className="input" value={displayName} onChange={e=>setDisplayName(e.target.value)} /></div>
          </div>
          <div className="field">
            <label className="label">Rol</label>
            <div className="control">
              <div className="select is-fullwidth"><select value={role} onChange={e=>setRole(e.target.value as any)}>
                <option>DOCENTE</option><option>COORDINADOR</option><option>SECRETARIA</option>
              </select></div>
            </div>
          </div>

          <div className="field">
            <label className="label">Contraseña</label>
            <div className="control"><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
            <p className="help">Mínimo 6 caracteres.</p>
          </div>
          <div className="field">
            <label className="label">Confirmar contraseña</label>
            <div className="control"><input className="input" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} /></div>
            {password && confirm && password !== confirm && <p className="help is-danger">Las contraseñas no coinciden.</p>}
          </div>

          <div className="field">
            <label className="checkbox">
              <input type="checkbox" checked={sendInvite} onChange={e=>setSendInvite(e.target.checked)} />{' '}
              Enviar correo de restablecimiento para que el usuario cambie su clave
            </label>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button
            className={`button is-primary mr-2 ${creating?'is-loading':''}`}
            onClick={()=>onCreate({ email, displayName, role, password, sendInvite })}
            disabled={!canSubmit || !!creating}
          >
            Crear
          </button>
          <button className="button" onClick={onClose}>Cancelar</button>
        </footer>
      </div>
    </div>
  );
}
export const UserFormModal = memo(ModalCmp);
