/**
 * Hook estándar de Auth
 * Propósito: Exponer estado mínimo y acciones (login/logout) con manejo de error/loading
 * Entradas: ninguna
 * Salidas: { data:{ user, role }, loading, error, actions:{ signIn, signOut, init } }
 * Efectos: Suscripción a Auth vía init()
 */
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthError, selectAuthRole, selectAuthStatus, selectAuthUser } from '../store/selectors';
import { initAuthListener, signInWithEmailThunk, signOutThunk } from '../store/thunks';
import type { AppDispatch } from '@/app/store';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectAuthUser);
  const role = useSelector(selectAuthRole);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  const loading = status === 'loading';

  const init = useCallback(() => {
    void dispatch(initAuthListener());
  }, [dispatch]);

  const signIn = useCallback((email: string, password: string) => {
    return dispatch(signInWithEmailThunk({ email, password })).unwrap();
  }, [dispatch]);

  const signOut = useCallback(() => {
    return dispatch(signOutThunk()).unwrap();
  }, [dispatch]);

  const data = useMemo(() => ({ user, role }), [user, role]);

  return { data, loading, error, actions: { init, signIn, signOut } };
}
