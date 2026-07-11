import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { CONSTANTS } from "@/constants";
import type { IAuthState } from "@/types";

function getStoredValue(key: string) {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(key);
}

function setStoredValue(key: string, value: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, value);
  }
}

function removeStoredValue(key: string) {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(key);
  }
}

const initialState: IAuthState = {
  token: getStoredValue(CONSTANTS.LOCAL_STORAGE_TOKEN_KEY),
  role: getStoredValue(CONSTANTS.LOCAL_STORAGE_ROLE_KEY),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ token: string; role: string }>,
    ) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      setStoredValue(CONSTANTS.LOCAL_STORAGE_TOKEN_KEY, action.payload.token);
      setStoredValue(CONSTANTS.LOCAL_STORAGE_ROLE_KEY, action.payload.role);
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;

      if (action.payload) {
        setStoredValue(CONSTANTS.LOCAL_STORAGE_TOKEN_KEY, action.payload);
      } else {
        removeStoredValue(CONSTANTS.LOCAL_STORAGE_TOKEN_KEY);
      }
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      removeStoredValue(CONSTANTS.LOCAL_STORAGE_TOKEN_KEY);
      removeStoredValue(CONSTANTS.LOCAL_STORAGE_ROLE_KEY);
    },
  },
});

export const { logout, setAuth, setToken } = authSlice.actions;
export default authSlice.reducer;
