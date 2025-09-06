import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import AuthHeroLayout from '../components/AuthHeroLayout';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { selectIsAuthenticated } from '../store/selectors';
import { PrivateRoutes, PublicRoutes } from '@/shared/constants/routes';
import { BRANDING } from '@/shared/constants/branding';
import { requestPasswordResetThunk } from '../store/thunks';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store';

export default function LoginPage() {
  const { actions, loading, error } = useAuth();
  const isAuth = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    actions.init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuth) navigate(`/${PrivateRoutes.DASHBOARD}`);
  }, [isAuth, navigate]);

  const handleReset = async (emailHint?: string) => {
    const email = emailHint || prompt('Ingresa tu correo para recuperar la contraseña') || '';
    if (email) await dispatch(requestPasswordResetThunk({ email })).unwrap().catch(() => {});
  };

  return (
    <AuthHeroLayout>
      <div className="card auth-card">
        <header className="card-header">
          <p className="card-header-title is-justify-content-center">
            <span className="auth-title">Inicio de sesión</span>
          </p>
        </header>
        <div className="card-content">
          <LoginForm
            loading={loading}
            error={error}
            onSubmit={(email, password) => actions.signIn(email, password).catch(() => {})}
          />
          <nav className="mt-3 is-flex is-justify-content-space-between">
            <button className="button is-text" onClick={() => handleReset()}>
              ¿Olvidaste tu contraseña?
            </button>
            <Link to={`/${PublicRoutes.LOGIN}`} className="button is-text">
              Crear cuenta
            </Link>
          </nav>
        </div>
      </div>
      <div className="auth-brand">
        {BRANDING.APP_NAME} • Foto de fondo: Pexels
      </div>
    </AuthHeroLayout>
  );
}
