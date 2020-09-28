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
    setCurrentCell: (state, { payload }): void => {
      state.activeCell = payload.id;
      state.selectedCell = payload.id;
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
    setCellType: (state, { payload }): void => {
      const { cellId, type } = payload;

      for (let i = 0; i < state.cells.length; i++) {
        if (cellId === state.cells[i].id) {
          state.cells[i].cell_type = type;
          break;
        }
      }
    },
    clearCellOutput: (state, { payload }): void => {
      const { cellId } = payload;

      for (let i = 0; i < state.cells.length; i++) {
        if (cellId === state.cells[i].id) {
          state.cells[i].outputs = [];
          break;
        }
      }
    },
    updateCellOutput: (state, { payload }): void => {
      const { cellId, output } = payload;

      let cell = null;
      for (let i = 0; i < state.cells.length; i++) {
        if (cellId === state.cells[i].id) {
          cell = state.cells[i];
          break;
        }
      }

      if (cell) {
        switch (output.msg_type) {
          case "execute_input":
            cell.execution_count = output.content.execution_count;
            break;

          case "stream":
            if (cell.outputs.length === 0) {
              cell.outputs.push({
                output_type: output.msg_type,
                name: output.content.name,
                text: [output.content.text],
              });
            } else {
              const out = cell.outputs[cell.outputs.length - 1];

              out.text.push(output.content.text);
            }
            // const output = cell.outputs[cell.outputs.length]
            break;

          case "display_data":
            cell.outputs.push({
              output_type: output.msg_type,
              ...output.content,
            });
            break;

          case "error":
            cell.outputs.push({
              output_type: output.msg_type,
              ...output.content,
            });
            break;

          default:
            cell.outputs.push({
              output_type: output.msg_type,
              ...output.content,
            });
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
