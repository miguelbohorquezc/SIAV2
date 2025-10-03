import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../../features/auth/store/slice";
import { usersReducer } from "@/features/users/store/slice";
import { reducer as admisionesReducer, reducerKey as admisionesReducerKey } from '@/features/admisiones/store/slice';
import { reducer as matriculaReducer, reducerKey as matriculaReducerKey } from '@/features/matriculaForm/store/slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    usersAdmin: usersReducer,
    [admisionesReducerKey]: admisionesReducer,
    [matriculaReducerKey]: matriculaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
