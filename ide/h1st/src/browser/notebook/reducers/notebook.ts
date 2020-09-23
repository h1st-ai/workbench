import { createSlice } from "@reduxjs/toolkit";

// import {
//   EXECUTE_CELL
// } from '../const';

import { INotebook, IStore } from "../types";

const initialState: INotebook = {
  cells: [],
  selectedCell: null,
  activeCell: null,
};

export const NotebookSlice = createSlice({
  name: "notebook",
  initialState,
  reducers: {
    setCells: (state, { payload }): void => {
      state.cells = payload.cells;
    },
    setSelectedCell: (state, { payload }): void => {
      state.selectedCell = payload.id;
    },
    setActiveCell: (state, { payload }): void => {
      state.activeCell = payload.id;
    },
  },
});

// Actions
export const notebookActions = NotebookSlice.actions;

// Selector
export const selectNotebook = (state: IStore): INotebook => state.notebook;

export default NotebookSlice.reducer;
