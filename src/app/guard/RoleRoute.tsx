/**
 * RoleRoute: protege rutas privadas por rol.
 * Espera a que el rol esté disponible (usa auth.status) y normaliza el valor.
 */
import type { PropsWithChildren, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import type { RootState } from '@/app/store';
import type { Role } from '@/shared/constants/auth'; // usa tu tipo de auth

type Props = PropsWithChildren<{
  allowed: Role[];
  fallbackTo?: string;          // p.ej. '/dashboard'
  loadingFallback?: ReactElement;
}>;

export default function RoleRoute({
  allowed,
  fallbackTo = '/dashboard',
  loadingFallback = (
    <div className="section"><progress className="progress is-primary" max={100} /></div>
  ),
  children,
}: Props): ReactElement {
  const location = useLocation();

  // ADAPTA a tus selectores reales si quieres (tienes selectores ya hechos)
  const status = useSelector((s: RootState) => (s as any).auth?.status as 'idle'|'loading'|'authenticated'|'unauthenticated'|undefined);
  const user   = useSelector((s: RootState) => (s as any).auth?.user as { uid:string } | null | undefined);
  const roleRaw = useSelector((s: RootState) => (s as any).auth?.role as string | undefined);

  // no autenticado aún o sin usuario -> login
  if (status === 'unauthenticated' || (!user && status !== 'loading')) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // mientras carga el listener/rol -> loader (evita redirecciones falsas)
  if (status === 'loading' || !roleRaw) {
    return loadingFallback;
  }

  const role = roleRaw.toUpperCase();
  const allowedSet = allowed.map(r => r.toUpperCase());
  if (!allowedSet.includes(role)) {
    return <Navigate to={fallbackTo} replace state={{ denied: true, from: location }} />;
  }

  return <>{children}</>;
}
