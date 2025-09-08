import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { AppUser } from '../types';
import {
  fetchUsersThunk,
  createUserWithPasswordThunk,
  createUserAndInviteThunk,
  updateUserRoleStatusThunk,
  sendPasswordResetForUserThunk,
} from './thunks';

const adapter = createEntityAdapter<AppUser>({
  selectId: (u) => u.uid,
  sortComparer: (a, b) => b.createdAt - a.createdAt,
});

interface UIState {
  loading: boolean;
  error?: string;
  modalOpen: boolean;
  selected?: string | null;
  updating: Record<string, boolean>;
  resetting: Record<string, boolean>;
  actionInfo?: string;
}
const initialState = adapter.getInitialState<UIState>({
  loading: false,
  error: undefined,
  modalOpen: false,
  selected: null,
  updating: {},
  resetting: {},
  actionInfo: undefined,
});

export const usersSlice = createSlice({
  name: 'usersAdmin',
  initialState,
  reducers: {
    openModal(state) { state.modalOpen = true; state.error = undefined; },
    closeModal(state) { state.modalOpen = false; state.selected = null; },
    clearInfo(state) { state.actionInfo = undefined; state.error = undefined; },
  },
  extraReducers(builder) {
    builder
      // LIST
      .addCase(fetchUsersThunk.pending, (s) => { s.loading = true; s.error = undefined; })
      .addCase(fetchUsersThunk.fulfilled, (s, a) => { s.loading = false; adapter.setAll(s, a.payload); })
      .addCase(fetchUsersThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; })

      // CREATE with password
      .addCase(createUserWithPasswordThunk.pending, (s) => { s.error = undefined; s.actionInfo = undefined; })
      .addCase(createUserWithPasswordThunk.fulfilled, (s, a) => {
        adapter.addOne(s, a.payload);
        s.actionInfo = `Usuario creado: ${a.payload.email}.`;
      })
      .addCase(createUserWithPasswordThunk.rejected, (s, a) => { s.error = a.payload as string; })

      // CREATE (compat)
      .addCase(createUserAndInviteThunk.fulfilled, (s, a) => {
        adapter.addOne(s, a.payload);
        s.actionInfo = `Usuario creado e invitación enviada a ${a.payload.email}.`;
      })
      .addCase(createUserAndInviteThunk.rejected, (s, a) => { s.error = a.payload as string; })

      // UPDATE
      .addCase(updateUserRoleStatusThunk.pending, (s, a) => { s.updating[a.meta.arg.uid] = true; s.error = undefined; s.actionInfo = undefined; })
      .addCase(updateUserRoleStatusThunk.fulfilled, (s, a) => {
        const { uid, changes } = a.payload;
        s.updating[uid] = false;
        adapter.updateOne(s, { id: uid, changes });
      })
      .addCase(updateUserRoleStatusThunk.rejected, (s, a) => { s.updating[a.meta.arg.uid] = false; s.error = a.payload as string; })

      // RESET
      .addCase(sendPasswordResetForUserThunk.pending, (s, a) => { s.resetting[a.meta.arg.email] = true; s.error = undefined; s.actionInfo = undefined; })
      .addCase(sendPasswordResetForUserThunk.fulfilled, (s, a) => { s.resetting[a.meta.arg.email] = false; s.actionInfo = `Se envió el correo de restablecimiento a ${a.meta.arg.email}.`; })
      .addCase(sendPasswordResetForUserThunk.rejected, (s, a) => { s.resetting[a.meta.arg.email] = false; s.error = a.payload as string; });
  },
});

export const usersReducer = usersSlice.reducer;
export const { openModal, closeModal, clearInfo } = usersSlice.actions;
export const usersAdapter = adapter;
