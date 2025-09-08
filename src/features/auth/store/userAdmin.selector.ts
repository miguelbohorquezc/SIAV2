import { createSelector } from '@reduxjs/toolkit';
import { usersAdminAdapter } from './userAdmin.slice';
import type { RootState } from '@/app/store';

const base = (s: RootState) => s.usersAdmin;
export const usersAdminSelectors = usersAdminAdapter.getSelectors(base);
export const selectUsersAdminUI = createSelector(base, s => s);
