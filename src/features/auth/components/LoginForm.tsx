import { memo, useState } from 'react';
import { AUTH_MESSAGES } from '@/shared/constants/auth';

export interface LoginFormProps {
  loading?: boolean;
  error?: string;
  onSubmit: (email: string, password: string) => void;
}

function LoginFormBase({ loading, error, onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const canSubmit = email.trim().length > 0 && password.trim().length > 0 && !loading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert(AUTH_MESSAGES.REQUIRED_EMAIL);
    if (!password) return alert(AUTH_MESSAGES.REQUIRED_PASSWORD);
    onSubmit(email.trim(), password);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Formulario de inicio de sesión">
      <h1 className="title is-5 has-text-weight-bold">Iniciar sesión</h1>
      <p className="subtitle is-6">Colina Campestre School</p>

      {/* Correo */}
      <div className="field mt-4">
        <label className="label">Usuario</label>
        <div className="control has-icons-left">
          <input
            id="email"
            className="input"
            type="email"
            placeholder="correo@colegio.edu.co"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required
            aria-invalid={!!error}
          />
          <span className="icon is-small is-left" aria-hidden="true">
            {/* Mail (Heroicons outline) */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
              <path d="m22 8-10 6L2 8" />
            </svg>
          </span>
        </div>
      </div>

      {/* Contraseña */}
      <div className="field">
        <label className="label" htmlFor="password">Contraseña</label>
        <div className="control has-icons-left">
          <input
            id="password"
            className="input"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required
          />
          <span className="icon is-small is-left" aria-hidden="true">
            {/* Lock (Heroicons outline) */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="9" rx="2" ry="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
          </span>
        </div>
      </div>

      {error && <p className="notification is-danger is-light" role="alert">{error}</p>}

      <div className="field mt-4">
        <div className="control">
          <button className={`button is-black is-fullwidth ${loading ? 'is-loading' : ''}`} type="submit" disabled={!canSubmit}>
            Entrar
          </button>
        </div>
      </div>
    </form>
  );
}

export const LoginForm = memo(LoginFormBase);
