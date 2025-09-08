import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  listUsers,
  createUserAndInvite,
  createUserWithPassword,
  updateUserRoleStatus,
  sendPasswordResetForUser,
} from '../services/repository';
import type {
  CreateUserInput,
  CreateUserWithPasswordInput,
  UpdateUserInput,
  AppUser,
} from '../types';
import { mapFirebaseAuthError, mapFirestoreError } from '@/shared/utils/errorMap';

export const fetchUsersThunk = createAsyncThunk<
  AppUser[],
  { role?: string; status?: string; qText?: string },
  { rejectValue: string }
>('usersAdmin/fetchUsers', async (args, { rejectWithValue }) => {
  try {
    return await listUsers(args);
  } catch (err) {
    return rejectWithValue(mapFirestoreError(err));
  }
});

export const createUserWithPasswordThunk = createAsyncThunk<
  AppUser,
  CreateUserWithPasswordInput,
  { rejectValue: string }
>('usersAdmin/createUserWithPassword', async (input, { rejectWithValue }) => {
  try {
    return await createUserWithPassword(input);
  } catch (err) {
    return rejectWithValue(mapFirebaseAuthError(err));
  }
});

// (compat) por si en algún lado usas el viejo flujo
export const createUserAndInviteThunk = createAsyncThunk<
  AppUser,
  CreateUserInput,
  { rejectValue: string }
>('usersAdmin/createUserAndInvite', async (input, { rejectWithValue }) => {
  try {
    return await createUserAndInvite(input);
  } catch (err) {
    return rejectWithValue(mapFirebaseAuthError(err));
  }
});

export const updateUserRoleStatusThunk = createAsyncThunk<
  { uid: string; changes: Partial<AppUser> },
  UpdateUserInput,
  { rejectValue: string }
>('usersAdmin/updateUserRoleStatus', async (input, { rejectWithValue }) => {
  try {
    return await updateUserRoleStatus(input);
  } catch (err) {
    return rejectWithValue(mapFirestoreError(err));
  }
});

export const sendPasswordResetForUserThunk = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>('usersAdmin/sendPasswordResetForUser', async ({ email }, { rejectWithValue }) => {
  try {
    await sendPasswordResetForUser(email);
  } catch (err) {
    return rejectWithValue(mapFirebaseAuthError(err));
  }
});
