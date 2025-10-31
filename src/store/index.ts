import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminModalReducer from "./slices/adminModalSlice";
import adminDetailStateSliceReducer from "./slices/adminDetailStateSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminModal: adminModalReducer,
    adminDetailState: adminDetailStateSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
