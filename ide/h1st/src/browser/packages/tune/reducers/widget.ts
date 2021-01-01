import { combineReducers, createSlice } from '@reduxjs/toolkit';
import {
  IAddExperimentPayload,
  IWidgetExperimentSlice,
  ISetWidgetLoadingPayload,
  IWidgetStore,
} from '../types';

const initialState: IWidgetExperimentSlice = {
  data: [],
  loaded: false,
  loading: false,
};

export const ExperimentWidget = createSlice({
  name: 'widget',
  initialState,
  reducers: {
    setLoading: (state, { payload }: ISetWidgetLoadingPayload): void => {
      state.loading = payload.loading;
    },
    addExperiments: (state, { payload }: IAddExperimentPayload): void => {
      state.data = state.data.concat(...payload.data);
    },
  },
});

// Actions
export const expActions = ExperimentWidget.actions;

// Selector
export const selectExperiment = (state: IWidgetStore): IWidgetExperimentSlice =>
  state.widget;

// export default ExperimentWidget.reducer;
export default combineReducers({
  widget: ExperimentWidget.reducer,
});
