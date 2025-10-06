import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../../features/auth/store/slice";
import { usersReducer } from "@/features/users/store/slice";
import { reducer as admisionesReducer, reducerKey as admisionesReducerKey } from '@/features/admisiones/store/slice';
import { reducer as matriculaReducer, reducerKey as matriculaReducerKey } from '@/features/matriculaForm/store/slice';
import { reducer as adminMatriculaReducer, reducerKey as adminMatriculaKey } from '@/features/admin-matricula/store/slice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    usersAdmin: usersReducer,
    [admisionesReducerKey]: admisionesReducer,
    [matriculaReducerKey]: matriculaReducer,
    [adminMatriculaKey]: adminMatriculaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
