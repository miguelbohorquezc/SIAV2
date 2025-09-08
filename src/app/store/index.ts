import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../../features/auth/store/slice";
import { usersReducer } from "@/features/users/store/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    usersAdmin: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
