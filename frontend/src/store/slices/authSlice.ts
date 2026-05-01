import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuthState } from '@/types';
import { CONSTANTS } from '@/constants';

const initialState: IAuthState = {
  token: localStorage.getItem(CONSTANTS.LOCAL_STORAGE_TOKEN_KEY) || null,
  role: localStorage.getItem(CONSTANTS.LOCAL_STORAGE_ROLE_KEY) || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ token: string; role: string }>,
    ) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      localStorage.setItem(CONSTANTS.LOCAL_STORAGE_TOKEN_KEY, action.payload.token);
      localStorage.setItem(CONSTANTS.LOCAL_STORAGE_ROLE_KEY, action.payload.role);
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem(CONSTANTS.LOCAL_STORAGE_TOKEN_KEY, action.payload);
      } else {
        localStorage.removeItem(CONSTANTS.LOCAL_STORAGE_TOKEN_KEY);
      }
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      localStorage.removeItem(CONSTANTS.LOCAL_STORAGE_TOKEN_KEY);
      localStorage.removeItem(CONSTANTS.LOCAL_STORAGE_ROLE_KEY);
    },
  },
});

export const { setToken, setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
