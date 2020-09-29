import { createSlice } from "@reduxjs/toolkit";

// import {
//   EXECUTE_CELL
// } from '../const';

import { CELL_TYPE, INotebook, IStore } from "../types";

const initialState: INotebook = {
  cells: [],
  selectedCell: null,
  activeCell: null,
  activeTheme: null,
  focusedCell: null,
  executionQueue: [],
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
    focusOnCell: (state, { payload }): void => {
      state.focusedCell = payload.cellId;
    },
    setCells: (state, { payload }): void => {
      state.cells = payload.cells;
    },
    setSelectedCell: (state, { payload }): void => {
      state.selectedCell = payload.cellId;
    },
    setActiveCell: (state, { payload }): void => {
      state.activeCell = payload.cellId;
    },
    setCurrentCell: (state, { payload }): void => {
      state.activeCell = payload.cellId;
      state.selectedCell = payload.cellId;
    },
    setActiveTheme: (state, { payload }): void => {
      state.activeTheme = payload;
    },
    setCellInput: (state, { payload }): void => {
      const { cellId, code } = payload;

      for (let i = 0; i < state.cells.length; i++) {
        if (cellId === state.cells[i].id) {
          console.log("setCellInput", code);
          const content = code.split("\n");

          state.cells[i].source = content.map((line: string, index: number) =>
            index < content.length - 1 ? line + "\n" : line
          );
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

      const cell = selectCell(state, cellId);

      if (cell) {
        console.log("clearning cell output", cellId);
        cell.outputs = [];
      }
    },
    clearCellOutputs: (state): void => {
      const cells = state.cells.map((cell) => ({
        ...cell,
        outputs: [],
      }));

      state.cells = cells;
    },
    updateCellOutput: (state, { payload }): void => {
      const { cellId, output } = payload;

      let cell = selectCell(state, cellId);

      if (cell) {
        switch (output.msg_type) {
          case "execute_input":
            cell.execution_count = output.content.execution_count;
            break;

          case "execute_reply":
            // cell.execution_count = output.content.execution_count;
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
      } else {
        state.cells.push(cell);
      }
    },

    insertCellAfter: (state, { payload }): void => {
      const { cell, cellId } = payload;

      const cellIndex = getCellIndex(state, cellId);

      if (cellIndex !== null) {
        state.cells.splice(cellIndex + 1, 0, cell);
      } else {
        state.cells.push(cell);
      }
    },
    addCellToQueue: (state, { payload }): void => {
      state.executionQueue = state.executionQueue.concat(payload.id);
    },
    removeCellFromQueue: (state): void => {
      state.executionQueue.shift();
    },
    addCellRangeToQueue: (state, { payload }): void => {
      const { cellId } = payload;
      let startIndex: number | null = 0;

      if (cellId) {
        startIndex = getCellIndex(state, cellId);

        if (!startIndex) {
          startIndex = 0;
        }
      }

      const excutingCells: string[] = [];
      for (let i = startIndex; i < state.cells.length; i++) {
        if (state.cells[i].cell_type === CELL_TYPE.CODE) {
          excutingCells.push(state.cells[i].id);
        }
      }

      state.executionQueue = state.executionQueue.concat(excutingCells);
    },
    addCellsAfterIndexToQueue: (state, { payload }): void => {
      console.log("addCellsAfterIndexToQueue");
      const { startIndex } = payload;

      const excutingCells: string[] = [];
      for (let i = startIndex; i < state.cells.length; i++) {
        if (state.cells[i].cell_type === CELL_TYPE.CODE) {
          excutingCells.push(state.cells[i].id);
        }
      }

      state.executionQueue = state.executionQueue.concat(excutingCells);
    },
    clearQueue: (state): void => {
      state.executionQueue = [];
    },
  },
});

// Actions
export const notebookActions = NotebookSlice.actions;

// Selector
export const selectNotebook = (state: IStore): INotebook => state.notebook;

export default NotebookSlice.reducer;
