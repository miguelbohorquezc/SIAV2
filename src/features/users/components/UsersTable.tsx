import { memo } from 'react';
import type { AppUser } from '../types';

interface Props {
  items?: AppUser[];
  loading: boolean;
  error?: string;
  updatingMap?: Record<string, boolean>;
  resettingMap?: Record<string, boolean>;
  onEditRole: (uid: string, role: AppUser['role']) => void;
  onToggleStatus: (uid: string, nextStatus: AppUser['status']) => void;
  onResetPassword: (email: string) => void;
}

function UsersTableCmp({
  items = [],
  loading,
  error,
  updatingMap = {},
  resettingMap = {},
  onEditRole,
  onToggleStatus,
  onResetPassword,
}: Props) {
  if (loading) return <p className="notification is-info" role="status">Cargando usuarios…</p>;
  if (error) return <p className="notification is-danger" role="alert">{error}</p>;
  if (!items.length) return <p className="notification is-light">Sin usuarios.</p>;

  return (
    <div className="table-container">
      <table className="table is-fullwidth is-striped table is-bordered" role="table" aria-label="Usuarios">
        <thead>
          <tr>
            <th>Correo</th><th>Nombre</th><th>Rol</th><th>Estado</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map(u => {
            const rowUpdating = !!updatingMap?.[u.uid];
            const emailKey = u.email ?? ''; // evita undefined
            const resetting = !!resettingMap?.[emailKey];

            return (
              <tr key={u.uid} aria-busy={rowUpdating}>
                <td><p className='has-text-primary-invert'>{u.email || '—'}</p></td>
                <td><p className='has-text-primary-invert'>{u.displayName ?? '—'}</p></td>
                <td>
                  <div className="select is-small">
                    <select
                      aria-label={`Rol de ${u.email ?? u.uid}`}
                      value={u.role}
                      disabled={rowUpdating}
                      onChange={(e) => onEditRole(u.uid, e.target.value as any)}
                    >
                      <option value="DOCENTE">DOCENTE</option>
                      <option value="COORDINADOR">COORDINADOR</option>
                      <option value="SECRETARIA">SECRETARIA</option>
                    </select>
                  </div>
                </td>
                <td>
                  <button
                    className={`button is-small ${rowUpdating ? 'is-loading' : (u.status==='ACTIVE'?'is-success':'is-warning')}`}
                    onClick={() => onToggleStatus(u.uid, u.status==='ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                    disabled={rowUpdating}
                    aria-live="polite"
                  >
                    {u.status}
                  </button>
                </td>
                <td>
                  <button
                    className={`button is-small ${resetting ? 'is-loading' : ''}`}
                    onClick={() => u.email && onResetPassword(u.email)}
                    disabled={!u.email || resetting}
                    title={!u.email ? 'Este usuario no tiene email' : 'Enviar correo de restablecimiento'}
                  >
                    Restablecer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export const UsersTable = memo(UsersTableCmp);
