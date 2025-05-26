import { createSlice } from '@reduxjs/toolkit';
import { type AuthUserData } from '../../models/userModels';

const initialState: AuthUserData = {
  userData: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.userData = action.payload;
      state.isAuthenticated = true;
    },
    logoutSuccess: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
