import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthStatus, selectAuthUser } from '@/features/auth/store/selectors';
import { PublicRoutes } from '@/shared/constants/routes';

export default function PrivateRoute({ children }: PropsWithChildren) {
  const status = useSelector(selectAuthStatus);
  const user = useSelector(selectAuthUser);

  if (status === 'loading') {
    return <div className="section"><progress className="progress is-small is-primary" max={100} /></div>;
  }
  if (!user) {
    return <Navigate to={`/${PublicRoutes.LOGIN}`} replace />;
  }
  return <>{children}</>;
}
