import { createSlice } from "@reduxjs/toolkit";
import { IStore } from "../types";

import { IAddExperimentPayload, IExperimentSlice } from "../types";

const initialState: IExperimentSlice = {
  data: [],
  loaded: false,
  loading: false,
};

export const ExperimentSlice = createSlice({
  name: "tunes",
  initialState,
  reducers: {
    addExperiments: (state, { payload }: IAddExperimentPayload): void => {
      state.data = state.data.concat(...payload.data);
    },
  },
});

// Actions
export const expActions = ExperimentSlice.actions;

// Selector
export const selectExperiment = (state: IStore): IExperimentSlice =>
  state.tunes;

export default ExperimentSlice.reducer;
