import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Client } from "@/types/api";

interface AuthState {
  user: Client | null;
  token: string | null;
  isAuthenticated: boolean;
}

const getStoredToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};

const getStoredUser = (): Client | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("auth_user");
    try {
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Failed to parse stored user", error);
      return null;
    }
  }
  return null;
};

const token = getStoredToken();
const user = getStoredUser();

const initialState: AuthState = {
  user: user,
  token: token,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: Client; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_token", action.payload.token);
        localStorage.setItem("auth_user", JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
      }
    },
    initializeAuth: (state) => {
      const token = getStoredToken();
      const user = getStoredUser();
      if (token && user) {
        state.token = token;
        state.user = user;
        state.isAuthenticated = true;
      }
    },
  },
});

export const { setAuth, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
