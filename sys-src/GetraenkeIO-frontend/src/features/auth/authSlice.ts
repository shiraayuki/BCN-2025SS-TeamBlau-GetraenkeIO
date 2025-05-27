import { createSlice } from '@reduxjs/toolkit';
import { type AuthUserData } from '../../models/userModels';

const storedUser = localStorage.getItem('authUserData');

const initialState: AuthUserData = storedUser
  ? {
      userData: JSON.parse(storedUser),
      isAuthenticated: true,
    }
  : {
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

      localStorage.setItem('authUserData', JSON.stringify(action.payload));
    },
    logoutSuccess: (state) => {
      state.userData = null;
      state.isAuthenticated = false;

      localStorage.removeItem('authUserData');
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
