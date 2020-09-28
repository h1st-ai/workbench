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

const selectCell = (state: any, cellId: string) => {
  for (let i = 0; i < state.cells.length; i++) {
    if (cellId === state.cells[i].id) {
      return state.cells[i];
    }
  }
};

const getCellIndex = (state: any, cellId: string): number | null => {
  for (let i = 0; i < state.cells.length; i++) {
    if (cellId === state.cells[i].id) {
      return i;
    }
  }

  return null;
};

// const getCellAndIndex = (state: any, cellId: string) => {
//   for (let i = 0; i < state.cells.length; i++) {
//     if (cellId === state.cells[i].id) {
//       return [state.cells[i], i];
//     }
//   }

//   return null;
// };

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
          const content = code.split("\n");

          state.cells[i].source = content.map((line: string) => line + "\n");
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

      let cell = selectCell(state, cellId);

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

    deleteCell: (state, { payload }): void => {
      const { cellId } = payload;

      const cellIndex = getCellIndex(state, cellId);

      if (cellIndex !== null) {
        state.cells.splice(cellIndex, 1);
      }
    },

    moveCellUp: (state, { payload }): void => {
      const cellIndex = getCellIndex(state, payload.cellId);

      if (cellIndex !== null) {
        if (cellIndex > 0) {
          const cell = state.cells.splice(cellIndex, 1)[0];
          state.cells.splice(cellIndex - 1, 0, cell);
        }
      }
    },

    moveCellDown: (state, { payload }): void => {
      const cellIndex = getCellIndex(state, payload.cellId);

      if (cellIndex !== null) {
        if (cellIndex < state.cells.length - 1) {
          const cell = state.cells.splice(cellIndex, 1)[0];
          state.cells.splice(cellIndex + 1, 0, cell);
        }
      }
    },

    insertCellBefore: (state, { payload }): void => {
      const { cell, cellId } = payload;

      const cellIndex = getCellIndex(state, cellId);

      if (cellIndex !== null) {
        state.cells.splice(cellIndex, 0, cell);
      }
    },

    insertCellAfter: (state, { payload }): void => {
      const { cell, cellId } = payload;

      const cellIndex = getCellIndex(state, cellId);

      if (cellIndex !== null) {
        state.cells.splice(cellIndex + 1, 0, cell);
      }
    },
  },
});

// Actions
export const notebookActions = NotebookSlice.actions;

// Selector
export const selectNotebook = (state: IStore): INotebook => state.notebook;

export default NotebookSlice.reducer;
