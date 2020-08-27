import { createSlice } from '@reduxjs/toolkit';

import {
  SWITCH_PROJECT_VIEW,
  VIEW_MODE_GRID,
  VIEW_MODE_LIST,
} from 'constants/actions';

import { IDashboardSlice, IStore } from 'types/store';

const initialState: IDashboardSlice = {
  searchKeyword: '',
  viewMode: VIEW_MODE_GRID,
  projects: [],
};

export const DashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    switchViewMode: (state): void => {
      if (state.viewMode === VIEW_MODE_GRID) {
        state.viewMode = VIEW_MODE_LIST;
      } else {
        state.viewMode = VIEW_MODE_GRID;
      }
    },
    setSearchKeyword: (state, { payload }): void => {
      state.searchKeyword = payload.keyword;
    },
  },
});

// Actions
export const countActions = DashboardSlice.actions;

// Selector
export const selectDashboard = (state: IStore): IDashboardSlice =>
  state.dashboard;

export default DashboardSlice.reducer;
