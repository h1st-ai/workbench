import { createSlice } from "@reduxjs/toolkit";

// import {
//   EXECUTE_CELL
// } from '../const';

import { INotebook, IStore } from "../types";

const initialState: INotebook = {
  cells: [],
  selectedCell: null,
  activeCell: null,
  activeTheme: null,
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
    setActiveTheme: (state, { payload }): void => {
      state.activeTheme = payload;
    },
    setCellInput: (state, { payload }): void => {
      const { cellId, code } = payload;

      for (let i = 0; i < state.cells.length; i++) {
        if (cellId === state.cells[i].id) {
          state.cells[i].source = code.split("\n");
        }
      }
    },
  },
});

// Actions
export const notebookActions = NotebookSlice.actions;

// Selector
export const selectNotebook = (state: IStore): INotebook => state.notebook;

export default NotebookSlice.reducer;
