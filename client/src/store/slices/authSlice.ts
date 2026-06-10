import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '../../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  hasSeenOnboarding: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  hasSeenOnboarding: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.hasSeenOnboarding = true; // Once logged in, they must have seen it
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    completeOnboarding: (state) => {
      state.hasSeenOnboarding = true;
    },
  },
});

export const { login, logout, completeOnboarding } = authSlice.actions;
export default authSlice.reducer;
