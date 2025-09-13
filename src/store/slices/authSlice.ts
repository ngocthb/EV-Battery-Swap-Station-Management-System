import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  isAdmin: boolean;
  id: string;
  name: string;
  role: "user" | "admin";
  picture: string;
};

type AuthState = {
  user: User | null;
};

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userData: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { userData, logout } = authSlice.actions;
export default authSlice.reducer;
