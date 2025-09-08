import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { AppUser } from '@/features/auth/services/userAdmin.repository';
import {
  fetchUsersAdminThunk, createUserAndInviteThunk, updateUserRoleStatusThunk, sendPasswordResetForUserThunk,
} from './userAdmin.thunks';

const adapter = createEntityAdapter<AppUser>({
  selectId: u => u.uid,
  sortComparer: (a, b) => b.createdAt - a.createdAt,
});

interface UIState {
  loading: boolean;
  error?: string;
  modalOpen: boolean;
  selected?: string | null;
}

const initialState = adapter.getInitialState<UIState>({
  loading: false,
  error: undefined,
  modalOpen: false,
  selected: null,
});

export const usersAdminSlice = createSlice({
  name: 'usersAdmin',
  initialState,
  reducers: {
    openModal(state) { state.modalOpen = true; },
    closeModal(state) { state.modalOpen = false; state.selected = null; },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsersAdminThunk.pending, s => { s.loading = true; s.error = undefined; })
      .addCase(fetchUsersAdminThunk.fulfilled, (s, a) => { s.loading = false; adapter.setAll(s, a.payload); })
      .addCase(fetchUsersAdminThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(createUserAndInviteThunk.fulfilled, (s, a) => { adapter.addOne(s, a.payload); })
      .addCase(createUserAndInviteThunk.rejected, (s, a) => { s.error = a.payload; })
      .addCase(updateUserRoleStatusThunk.rejected, (s, a) => { s.error = a.payload; })
      .addCase(sendPasswordResetForUserThunk.rejected, (s, a) => { s.error = a.payload; });
  },
});

export const usersAdminReducer = usersAdminSlice.reducer;
export const { openModal, closeModal } = usersAdminSlice.actions;
export const usersAdminAdapter = adapter;
