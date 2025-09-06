import type { RootState } from '@/app/store';

export const selectAuthState = (s: RootState) => s.auth;
export const selectAuthUser = (s: RootState) => s.auth.user;
export const selectAuthRole = (s: RootState) => s.auth.role;
export const selectAuthStatus = (s: RootState) => s.auth.status;
export const selectIsAuthenticated = (s: RootState) => s.auth.status === 'authenticated' && !!s.auth.user;
export const selectAuthError = (s: RootState) => s.auth.error;
