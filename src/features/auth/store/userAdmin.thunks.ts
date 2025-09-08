import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  listUsers, createUserAndInvite, updateUserRoleStatus, sendPasswordResetForUser,
  type CreateUserInput, type UpdateUserInput, type AppUser,
} from '@/features/auth/services/userAdmin.repository';
import { mapFirebaseAuthError, mapFirestoreError } from '@/shared/utils/errorMap';

export const fetchUsersAdminThunk = createAsyncThunk<
  AppUser[], { role?: string; status?: string; qText?: string }, { rejectValue: string }
>('usersAdmin/fetch', async (args, { rejectWithValue }) => {
  try {
    return await listUsers(args as any);
  } catch (err) {
    return rejectWithValue(mapFirestoreError(err));
  }
});

export const createUserAndInviteThunk = createAsyncThunk<
  AppUser, CreateUserInput, { rejectValue: string }
>('usersAdmin/createAndInvite', async (input, { rejectWithValue }) => {
  try {
    return await createUserAndInvite(input);
  } catch (err) {
    return rejectWithValue(mapFirebaseAuthError(err));
  }
});

export const updateUserRoleStatusThunk = createAsyncThunk<
  void, UpdateUserInput, { rejectValue: string }
>('usersAdmin/updateRoleStatus', async (input, { rejectWithValue }) => {
  try {
    await updateUserRoleStatus(input);
  } catch (err) {
    return rejectWithValue(mapFirestoreError(err));
  }
});

export const sendPasswordResetForUserThunk = createAsyncThunk<
  void, { email: string }, { rejectValue: string }
>('usersAdmin/sendReset', async ({ email }, { rejectWithValue }) => {
  try {
    await sendPasswordResetForUser(email);
  } catch (err) {
    return rejectWithValue(mapFirebaseAuthError(err));
  }
});
