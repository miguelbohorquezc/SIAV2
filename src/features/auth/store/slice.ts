import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '../types';
import type { Role } from '@/shared/constants/auth';
import { initAuthListener, signInWithEmailThunk, signOutThunk, fetchUserRole } from './thunks';

type Status = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  user: AuthUser | null;
  role: Role | null;
  status: Status;
  error?: string;
}

const initialState: AuthState = {
  user: null,
  role: null,
  status: 'idle',
  error: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // initAuthListener
      .addCase(initAuthListener.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(initAuthListener.fulfilled, (state, action: PayloadAction<{ user: AuthUser | null }>) => {
        state.user = action.payload.user;
        state.status = action.payload.user ? 'authenticated' : 'unauthenticated';
        if (!action.payload.user) state.role = null;
      })
      .addCase(initAuthListener.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = action.error.message;
        state.user = null;
        state.role = null;
      })
      // signIn
      .addCase(signInWithEmailThunk.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(signInWithEmailThunk.fulfilled, (state, action: PayloadAction<{ user: AuthUser }>) => {
        state.user = action.payload.user;
        state.status = 'authenticated';
      })
      .addCase(signInWithEmailThunk.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.error = action.error.message;
      })
      // signOut
      .addCase(signOutThunk.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.status = 'unauthenticated';
      })
      // fetchUserRole
      //@ts-ignore
      .addCase(fetchUserRole.pending, (state) => {
        // mantenemos status actual
      })
      .addCase(fetchUserRole.fulfilled, (state, action: PayloadAction<{ role: Role }>) => {
        state.role = action.payload.role;
      })
      .addCase(fetchUserRole.rejected, (state, action) => {
        state.role = null;
        state.error = action.error.message;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export const authReducer = authSlice.reducer;
