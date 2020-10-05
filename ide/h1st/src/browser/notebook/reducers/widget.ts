import { createSlice } from "@reduxjs/toolkit";

// import {
//   EXECUTE_CELL
// } from '../const';

import { INotebookWidget, IStore } from "../types";

const initialState: INotebookWidget = {
  width: null,
  height: null,
};

export const WidgetSlice = createSlice({
  name: "widget",
  initialState,
  reducers: {
    setWidth: (state, { payload }): void => {
      state.width = payload.width;
    },
    setHeight: (state, { payload }): void => {
      state.height = payload.height;
    },
    setDimension: (state, { payload }): void => {
      state.height = payload.height;
      state.width = payload.width;
    },
  },
});

// Actions
export const widgetActions = WidgetSlice.actions;

// Selector
export const selectWidget = (state: IStore): INotebookWidget => state.widget;

export default WidgetSlice.reducer;
