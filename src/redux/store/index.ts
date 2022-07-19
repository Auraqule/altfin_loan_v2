import { configureStore } from "@reduxjs/toolkit";
import loanReducer from "../slices/loanCalculatorSlice";
import user from "../slices/userSlice";

export const store = configureStore({
  reducer: {
    loanReducer: loanReducer,
    user: user,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
