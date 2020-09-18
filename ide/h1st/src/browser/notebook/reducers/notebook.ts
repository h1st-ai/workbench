import { createSlice } from "@reduxjs/toolkit";

// import {
//   EXECUTE_CELL
// } from '../const';

import { INotebook, IStore } from "../types";

const initialState: INotebook = {
  cells: [],
};

export const NotebookSlice = createSlice({
  name: "notebook",
  initialState,
  reducers: {
    setCells: (state, { payload }): void => {
      state.cells = payload.cells;
    },
  },
});

// Actions
export const notebookActions = NotebookSlice.actions;

// Selector
export const selectNotebook = (state: IStore): INotebook => state.notebook;

export default NotebookSlice.reducer;
