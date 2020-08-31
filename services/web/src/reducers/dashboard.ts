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
  showCreateProjectDialog: false,
  currentProjectStatus: null,
  pollingProjectId: null,
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
    setProjects: (state, { payload }): void => {
      state.projects = payload.projects;
    },
    addProject: (state, { payload }): void => {
      state.projects.unshift(payload.project);
    },
    toggleCreateProjectDialog: (state, body?): void => {
      if (body) {
        state.showCreateProjectDialog = body.payload.value;
      } else {
        state.showCreateProjectDialog = !state.showCreateProjectDialog;
      }
    },
    setCurrentProjectStatus: (state, { payload }): void => {
      state.currentProjectStatus = payload.status;
    },
    setPollingProjectId: (state, { payload }): void => {
      state.pollingProjectId = payload.id;
    },
  },
});

// Actions
export const dashboardActions = DashboardSlice.actions;

// Selector
export const selectDashboard = (state: IStore): IDashboardSlice =>
  state.dashboard;

export default DashboardSlice.reducer;
