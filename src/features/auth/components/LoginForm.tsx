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
          <span className="icon is-small is-left">
            <i className="fa-solid fa-envelope"></i>
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
          <span className="icon is-small is-left">
            <i className="fa-solid fa-lock"></i>
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
