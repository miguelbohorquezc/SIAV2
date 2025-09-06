import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  subscribeAuthChanges,
  signIn,
  signOut,
  register as registerAuth,
  requestPasswordReset,
  configureAuthPersistence,
} from '../services/auth.repository';
import { getUserProfile, createUserProfile } from '../services/user.repository';
import type { AuthUser } from '../types';
import type { Role } from '@/shared/constants/auth';

export const initAuthListener = createAsyncThunk<{ user: AuthUser | null }, void>(
  'auth/initAuthListener',
  async (_, { dispatch }) => {
    await configureAuthPersistence();
    return await new Promise<{ user: AuthUser | null }>((resolve) => {
      const unsub = subscribeAuthChanges((user) => {
        resolve({ user });
        if (user) void dispatch(fetchUserRole(user.uid));
      });
      void unsub;
    });
  }
);

export const signInWithEmailThunk = createAsyncThunk<
  { user: AuthUser },
  { email: string; password: string }
>('auth/signInWithEmail', async ({ email, password }, { dispatch }) => {
  const user = await signIn(email, password);
  await dispatch(fetchUserRole(user.uid)).unwrap();
  return { user };
});

export const registerThunk = createAsyncThunk<
  { user: AuthUser },
  { email: string; password: string; displayName?: string }
>('auth/register', async ({ email, password, displayName }, { dispatch }) => {
  const user = await registerAuth(email, password);
  await createUserProfile(user.uid, email, 'DOCENTE', displayName);
  await dispatch(fetchUserRole(user.uid)).unwrap();
  return { user };
});

export const requestPasswordResetThunk = createAsyncThunk<void, { email: string }>(
  'auth/requestPasswordReset',
  async ({ email }) => {
    await requestPasswordReset(email);
  }
);

export const signOutThunk = createAsyncThunk<void, void>('auth/signOut', async () => {
  await signOut();
});

export const fetchUserRole = createAsyncThunk<{ role: Role }, string>(
  'auth/fetchUserRole',
  async (uid: string) => {
    const profile = await getUserProfile(uid);
    return { role: profile.role };
  }
);
