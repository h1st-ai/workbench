import { createSlice } from "@reduxjs/toolkit";

// import {
//   EXECUTE_CELL
// } from '../const';

import { CELL_TYPE, INotebook, IStore } from "../types";

export const initialState: INotebook = {
  cells: [],
  selectedCell: null,
  selectedCells: [],
  activeCell: null,
  activeTheme: null,
  focusedCell: null,
  executionQueue: [],
  clipboard: [],
  pivotCell: null,
};

/**
 * get a cell info and the one prev and after
 * @param state - the notebook store
 * @param cellId - the id of the cell we want to select
 */
export const selectCellAndNeighbors = (state: any, cellId: string) => {
  for (let i = 0; i < state.cells.length; i++) {
    if (cellId === state.cells[i].id) {
      return {
        prev: state.cells[i - 1],
        cell: state.cells[i],
        next: state.cells[i + 1],
      };
    }
  }
};

export const selectCell = (state: any, cellId: string) => {
  for (let i = 0; i < state.cells.length; i++) {
    if (cellId === state.cells[i].id) {
      return state.cells[i];
    }
  }
};

export const getCellIndex = (state: any, cellId: string): number | null => {
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

export const reducers = {
  focusOnCell: (state: INotebook, { payload }: any): void => {
    state.focusedCell = payload.cellId;
  },
  setCells: (state: INotebook, { payload }: any): void => {
    state.cells = payload.cells;
  },
  setSelectedCell: (state: INotebook, { payload }: any): void => {
    state.selectedCell = payload.cellId;
    state.selectedCells = [payload.cellId];
  },
  selectNextCellOf: (state: INotebook, { payload }: any): void => {
    const cellInfo = selectCellAndNeighbors(state, payload.cellId);

    if (cellInfo && cellInfo.next) {
      state.selectedCell = cellInfo.next.id;
    }
  },
  selectPrevCellOf: (state: INotebook, { payload }: any): void => {
    const cellInfo = selectCellAndNeighbors(state, payload.cellId);

    if (cellInfo && cellInfo.prev) {
      state.selectedCell = cellInfo.prev.id;
    }
  },
  focusNextCellOf: (state: INotebook, { payload }: any): void => {
    const cellInfo = selectCellAndNeighbors(state, payload.cellId);

    console.log("focusNextCellOf", cellInfo);
    if (cellInfo && cellInfo.next) {
      const nextCellId = cellInfo.next.id;
      // state.selectedCell = nextCellId;
      // state.activeCell = nextCellId;
      state.focusedCell = nextCellId;
    }
  },
  focusPrevCellOf: (state: INotebook, { payload }: any): void => {
    const cellInfo = selectCellAndNeighbors(state, payload.cellId);

    if (cellInfo && cellInfo.prev) {
      const prevCellId = cellInfo.prev.id;

      if (cellInfo && cellInfo.next) {
        // state.selectedCell = nextCellId;
        // state.activeCell = nextCellId;
        state.focusedCell = prevCellId;
      }

      // if (cellInfo.prev.cell_type === CELL_TYPE.CODE) {
      //   state.focusedCell = prevCellId;
      // } else {
      //   state.activeCell = prevCellId;
      //   state.selectedCell = null;
      // }
    }
  },
  setActiveCell: (state: INotebook, { payload }: any): void => {
    state.activeCell = payload.cellId;
  },
  setCurrentCell: (state: INotebook, { payload }: any): void => {
    state.activeCell = payload.cellId;
    state.selectedCell = payload.cellId;
  },
  setActiveTheme: (state: INotebook, { payload }: any): void => {
    state.activeTheme = payload;
  },
  setCellInput: (state: INotebook, { payload }: any): void => {
    const { cellId, code } = payload;

    for (let i = 0; i < state.cells.length; i++) {
      if (cellId === state.cells[i].id) {
        const content = code.split("\n");

        state.cells[i].source = content.map((line: string, index: number) =>
          index < content.length - 1 ? line + "\n" : line
        );
      }
    }
  },
  setCellType: (state: INotebook, { payload }: any): void => {
    const { cellId, type } = payload;

    for (let i = 0; i < state.cells.length; i++) {
      if (cellId === state.cells[i].id) {
        state.cells[i].cell_type = type;
        break;
      }
    }
  },
  clearCellOutput: (state: INotebook, { payload }: any): void => {
    const { cellId } = payload;

    const cell = selectCell(state, cellId);

    if (cell) {
      cell.outputs = [];
    }
  },
  clearCellOutputs: (state: INotebook): void => {
    const cells = state.cells.map((cell) => ({
      ...cell,
      execution_count: 0,
      outputs: [],
    }));

    state.cells = cells;
  },
  updateCellOutput: (state: INotebook, { payload }: any): void => {
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

        // case "display_data":
        //   cell.outputs.push({
        //     output_type: output.msg_type,
        //     ...output.content,
        //   });
        //   break;

        // case "error":
        //   cell.outputs.push({
        //     output_type: output.msg_type,
        //     ...output.content,
        //   });
        //   break;

        default:
          cell.outputs.push({
            output_type: output.msg_type,
            ...output.content,
          });
      }
    }
  },
  deleteCell: (state: INotebook, { payload }: any): void => {
    const { cellId } = payload;

    const cellIndex = getCellIndex(state, cellId);

    if (cellIndex !== null) {
      state.cells.splice(cellIndex, 1);
    }
  },
  moveCellUp: (state: INotebook, { payload }: any): void => {
    const cellIndex = getCellIndex(state, payload.cellId);

    if (cellIndex !== null) {
      if (cellIndex > 0) {
        const cell = state.cells.splice(cellIndex, 1)[0];
        state.cells.splice(cellIndex - 1, 0, cell);
      }
    }
  },
  moveCellDown: (state: INotebook, { payload }: any): void => {
    const cellIndex = getCellIndex(state, payload.cellId);

    if (cellIndex !== null) {
      if (cellIndex < state.cells.length - 1) {
        const cell = state.cells.splice(cellIndex, 1)[0];
        state.cells.splice(cellIndex + 1, 0, cell);
      }
    }
  },
  insertCellBefore: (state: INotebook, { payload }: any): void => {
    const { cell, cellId } = payload;

    const cellIndex = getCellIndex(state, cellId);

    if (cellIndex !== null) {
      state.cells.splice(cellIndex, 0, cell);
    } else {
      state.cells.push(cell);
    }
  },

  insertCellAfter: (state: INotebook, { payload }: any): void => {
    const { cell, cellId } = payload;

    const cellIndex = getCellIndex(state, cellId);

    if (cellIndex !== null) {
      state.cells.splice(cellIndex + 1, 0, cell);
    } else {
      state.cells.push(cell);
    }
  },

  insertCellAt: (state: INotebook, { payload }: any): void => {
    const { cell, cellIndex } = payload;

    try {
      state.cells.splice(cellIndex, 0, cell);
    } catch {
      console.log("Failed to insert");
    }
  },

  addCellToQueue: (state: INotebook, { payload }: any): void => {
    state.executionQueue = state.executionQueue.concat(payload.cellId);
  },
  removeCellFromQueue: (state: INotebook): void => {
    console.log("removing cell from queue", state.executionQueue[0]);
    state.executionQueue.shift();
  },
  addCellsAfterCellToQueue: (state: INotebook, { payload }: any): void => {
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
  addCellsAfterIndexToQueue: (state: INotebook, { payload }: any): void => {
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
  clearQueue: (state: INotebook): void => {
    state.executionQueue = [];
  },
};

export const NotebookSlice = createSlice({
  name: "notebook",
  initialState,
  reducers,
});

// Actions
export const notebookActions = NotebookSlice.actions;

// Selector
export const selectNotebook = (state: IStore): INotebook => state.notebook;

export default NotebookSlice.reducer;
