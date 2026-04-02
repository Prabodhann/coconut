import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAuthState } from '@/types';
import { CONSTANTS } from '@/constants';

const initialState: IAuthState = {
  token: localStorage.getItem(CONSTANTS.LOCAL_STORAGE_TOKEN_KEY) || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
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
      localStorage.removeItem(CONSTANTS.LOCAL_STORAGE_TOKEN_KEY);
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
