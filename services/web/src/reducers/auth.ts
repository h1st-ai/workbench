import { createSlice } from '@reduxjs/toolkit';

import { IAuthSlice, IStore } from 'types/store';

const initialState: IAuthSlice = {
  token: '',
};

export const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, { payload }): void => {
      const { token } = payload;
      state = { ...state, token };
    },
  },
});

// Actions
export const authActions = AuthSlice.actions;

// Selector
export const selectAuth = (state: IStore): IAuthSlice => state.auth;

export default AuthSlice.reducer;
