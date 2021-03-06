import { createSlice } from "@reduxjs/toolkit";
import { NotebookFactory } from "../notebook-factory";

// import {
//   EXECUTE_CELL
// } from '../const';

import { CELL_TYPE, INotebook, IStore } from "../types";
import {
  IAddCellsToQueuePayload,
  ICutCellPayload,
  IDeleteCellsPayload,
  IPasteCellPayload,
  ISetActiveCellPayload,
  ISetCellsTypePayload,
  ISetClipboardCellPayload,
  IToggleActionOverlayPayload,
  IToggleCellOutputPayload,
} from "../types/payload";

const uniqid = require("uniqid");

export const initialState: INotebook = {
  cells: [],
  deletedCells: [],
  selectedCell: null,
  selectedCells: [],
  activeCell: null,
  activeTheme: null,
  focusedCell: null,
  executionQueue: [],
  clipboard: {
    context: null,
    cells: [],
  },
  pivotCell: null,
  options: {
    showLineNumber: false,
  },
  freeze: false,
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
        prev: { cell: state.cells[i - 1], index: i - 1 },
        cell: state.cells[i],
        next: { cell: state.cells[i + 1], index: i + 1 },
      };
    }
  }
};

export const selectNeighborIdsOfRange = (state: any, cellIds: string[]) => {
  if (Array.isArray(cellIds) && cellIds.length > 0) {
    if (cellIds.length === 1) {
      return selectCellAndNeighbors(state, cellIds[0]);
    }

    const first = cellIds[0];
    const last = cellIds[cellIds.length - 1];
    let prev;
    let next;

    console.log("selecting neighbors from", first, "to", last);

    for (let i = 0; i < state.cells.length; i++) {
      if (first === state.cells[i].id) {
        prev = {
          cell: state.cells[i - 1],
          index: i - 1,
        };
      }

      if (last === state.cells[i].id) {
        next = {
          cell: state.cells[i + 1],
          index: i + 1,
        };
      }
    }

    return {
      prev,
      next,
    };
  }
};

export const selectCell = (state: any, cellId: string) => {
  for (let i = 0; i < state.cells.length; i++) {
    if (cellId === state.cells[i].id) {
      return state.cells[i];
    }
  }
};

export const setSelectedCells = (state: any, cellId: string) => {
  state.selectedCells = [cellId];
  state.selectedCell = cellId;
};

export const getCellIdInSelectedRange = (
  state: any,
  fromId: string,
  toId: string
) => {
  if (!fromId || !toId || fromId === toId) {
    return [toId];
  }

  // we're gonna get the cell ranges between the pivot cell and the selected cell identified by cellId
  let inRange = false;
  const result: string[] = [];

  for (let i = 0; i < state.cells.length; i++) {
    const currentCell = state.cells[i];
    if (currentCell.id === fromId || currentCell.id === toId) {
      inRange = !inRange;

      // if it has become out of range, add the current cell and break
      if (!inRange) {
        console.log("out of range detected", currentCell.id, result);
        result.push(currentCell.id);
        return result;
      }
    }

    if (inRange) {
      console.log("collecting", currentCell.id, result);
      result.push(currentCell.id);
    }
  }

  return result;
};

export const getCellIndex = (
  state: any,
  cellId: string
): number | undefined => {
  for (let i = 0; i < state.cells.length; i++) {
    if (cellId === state.cells[i].id) {
      return i;
    }
  }

  return undefined;
};

// export const makeSingleEmptySelectCellAnd = (
//   state: any,
// ): void => {
//   const cell = NotebookFactory.makeNewCell();

//   state.cells = [cell];
//   state.selectedCell = []
// };

// const getCellAndIndex = (state: any, cellId: string) => {
//   for (let i = 0; i < state.cells.length; i++) {
//     if (cellId === state.cells[i].id) {
//       return [state.cells[i], i];
//     }
//   }

//   return null;
// };

export const reducers = {
  toogleActionOverlay: (
    state: INotebook,
    { payload }: IToggleActionOverlayPayload
  ): void => {
    const { show } = payload;

    if (show) {
      state.freeze = show;
    } else {
      state.freeze = !state.freeze;
    }
  },

  ensureCellInNotebook: (state: INotebook): void => {
    const cell = NotebookFactory.makeNewCell();

    state.cells = [cell];
    state.selectedCells = [cell.id];
    state.selectedCell = cell.id;
  },
  focusOnCell: (state: INotebook, { payload }: any): void => {
    const { cellId } = payload;
    state.focusedCell = cellId;
    // state.activeCell = cellId;
    // state.selectedCell = cellId;
    // state.selectedCells = [cellId];
  },
  setCells: (state: INotebook, { payload }: any): void => {
    state.cells = payload.cells;
  },
  setSelectedCell: (state: INotebook, { payload }: any): void => {
    const { cellId } = payload;

    state.selectedCell = cellId;
    state.selectedCells = [cellId];
    state.pivotCell = cellId;
  },
  setSelectedCells: (state: INotebook, { payload }: any): void => {
    const { cellId } = payload;
    state.selectedCell = cellId;

    let inRangeCellIds = [cellId];

    if (state.pivotCell && state.selectedCell) {
      inRangeCellIds = getCellIdInSelectedRange(
        state,
        state.pivotCell,
        state.selectedCell
      );
    }

    state.selectedCells = inRangeCellIds;
  },
  selectNextCellOf: (state: INotebook, { payload }: any): void => {
    const cellInfo = selectCellAndNeighbors(state, payload.cellId);

    if (cellInfo && cellInfo.next) {
      state.selectedCell = cellInfo.next.cell.id;
      state.selectedCells = [cellInfo.next.cell.id];
    }
  },
  selectPrevCellOf: (state: INotebook, { payload }: any): void => {
    const cellInfo = selectCellAndNeighbors(state, payload.cellId);

    if (cellInfo && cellInfo.prev) {
      state.selectedCell = cellInfo.prev.cell.id;
      state.selectedCells = [cellInfo.prev.cell.id];
    }
  },
  focusNextCellOf: (state: INotebook, { payload }: any): void => {
    const cellInfo = selectCellAndNeighbors(state, payload.cellId);

    console.log("focusNextCellOf", cellInfo);
    if (cellInfo && cellInfo.next) {
      const nextCellId = cellInfo.next.cell.id;
      // state.selectedCell = nextCellId;
      // state.activeCell = nextCellId;
      state.focusedCell = nextCellId;
    }
  },
  focusPrevCellOf: (state: INotebook, { payload }: any): void => {
    const cellInfo = selectCellAndNeighbors(state, payload.cellId);

    if (cellInfo && cellInfo.prev) {
      const prevCellId = cellInfo.prev.cell.id;

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
  setActiveCell: (
    state: INotebook,
    { payload }: ISetActiveCellPayload
  ): void => {
    state.activeCell = payload.cellId;
  },
  setCurrentCell: (state: INotebook, { payload }: any): void => {
    state.activeCell = payload.cellId;
    state.selectedCell = payload.cellId;
    state.selectedCells = [payload.cellId];
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
  setCellsType: (state: INotebook, { payload }: ISetCellsTypePayload): void => {
    const { cellIds, type } = payload;

    for (let i = 0; i < state.cells.length; i++) {
      if (cellIds.includes(state.cells[i].id)) {
        state.cells[i].cell_type = type;
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

  toggleCellLineNumber: (state: INotebook): void => {
    state.options.showLineNumber = !state.options.showLineNumber;
  },

  toggleCellOutputs: (
    state: INotebook,
    { payload }: IToggleCellOutputPayload
  ): void => {
    const { cellIds, show } = payload;

    state.cells.forEach((cell) => {
      if (cellIds.includes(cell.id)) {
        cell.metadata.collapsed = show;
      }
    });
  },

  deleteCells: (state: INotebook, { payload }: IDeleteCellsPayload): void => {
    const { cellIds } = payload;

    const cellIndex = getCellIndex(state, cellIds[0]);

    if (cellIndex !== undefined) {
      const neighbors = selectNeighborIdsOfRange(state, cellIds);
      const cells = state.cells.splice(cellIndex, cellIds.length);

      state.deletedCells = state.deletedCells.concat(
        cells.map((cell, index) => ({
          index: index + cellIndex,
          cell,
        }))
      );

      // set the active cell to one of its neigbors
      if (neighbors) {
        if (neighbors.next?.cell) {
          state.selectedCells = [neighbors.next.cell.id];
          state.selectedCell = neighbors.next.cell.id;
        } else if (neighbors.prev?.cell) {
          // setSelectedCells(state, neighbors.prev);
          state.selectedCells = [neighbors.prev.cell.id];
          state.selectedCell = neighbors.prev.cell.id;
        }
      }
    }
  },
  undoDeleteCell: (state: INotebook): void => {
    if (state.deletedCells.length > 0) {
      const last = state.deletedCells.pop();

      if (last) {
        state.cells.splice(last.index, 0, last.cell);
      }
    }
  },

  moveCellUp: (state: INotebook, { payload }: any): void => {
    const cellIndex = getCellIndex(state, payload.cellId);

    if (cellIndex !== undefined) {
      if (cellIndex > 0) {
        const cell = state.cells.splice(cellIndex, 1)[0];
        state.cells.splice(cellIndex - 1, 0, cell);
      }
    }
  },

  moveCellsUp: (state: INotebook, { payload }: any): void => {
    const { cellIds } = payload;
    const cellIndex = getCellIndex(state, cellIds[0]);

    if (cellIndex !== undefined) {
      if (cellIndex > 0) {
        const cells = state.cells.splice(cellIndex, cellIds.length);
        state.cells.splice(cellIndex - 1, 0, ...cells);
      }
    }
  },

  moveCellDown: (state: INotebook, { payload }: any): void => {
    const cellIndex = getCellIndex(state, payload.cellId);

    if (cellIndex !== undefined) {
      if (cellIndex < state.cells.length - 1) {
        const cell = state.cells.splice(cellIndex, 1)[0];
        state.cells.splice(cellIndex + 1, 0, cell);
      }
    }
  },

  moveCellsDown: (state: INotebook, { payload }: any): void => {
    const { cellIds } = payload;
    const cellIndex = getCellIndex(state, cellIds[0]);

    if (cellIndex !== undefined) {
      if (cellIndex < state.cells.length - 1) {
        const cells = state.cells.splice(cellIndex, cellIds.length);
        state.cells.splice(cellIndex + 1, 0, ...cells);
      }
    }
  },

  insertCellBefore: (state: INotebook, { payload }: any): void => {
    const { cell, cellId } = payload;

    const cellIndex = getCellIndex(state, cellId);

    if (cellIndex !== undefined) {
      state.cells.splice(cellIndex, 0, cell);
    } else {
      state.cells.push(cell);
    }
  },

  insertCellAfter: (state: INotebook, { payload }: any): void => {
    const { cell, cellId } = payload;

    const cellIndex = getCellIndex(state, cellId);

    if (cellIndex !== undefined) {
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

  cutCells: (state: INotebook, { payload }: ICutCellPayload): void => {
    let { cellIds } = payload;

    if (!cellIds) {
      cellIds = state.selectedCells;
    }

    const firstCellIndex = getCellIndex(state, cellIds[0]);

    if (firstCellIndex !== undefined) {
      const neighbors = selectNeighborIdsOfRange(state, cellIds);

      const cells = state.cells.splice(firstCellIndex, cellIds.length);

      state.clipboard = {
        context: "cut",
        cells,
      };

      console.log("cut cell neightbors", neighbors);

      // set the active cell to one of its neigbors
      if (neighbors) {
        if (neighbors.next) {
          state.selectedCells = [neighbors.next.cell.id];
          state.selectedCell = neighbors.next.cell.id;
        } else if (neighbors.prev) {
          // setSelectedCells(state, neighbors.prev);
          state.selectedCells = [neighbors.prev.cell.id];
          state.selectedCell = neighbors.prev.cell.id;
        }
      }
    }
  },

  copyCells: (state: INotebook, { payload }: ICutCellPayload): void => {
    let { cellIds } = payload;

    if (!cellIds) {
      cellIds = state.selectedCells;
    }

    const firstCellIndex = getCellIndex(state, cellIds[0]);

    if (firstCellIndex !== undefined) {
      const cells = [];

      for (let i = firstCellIndex; i < firstCellIndex + cellIds.length; i++) {
        cells.push({ ...state.cells[i], id: uniqid() });
      }

      state.clipboard = {
        context: "copy",
        cells,
      };
    }
  },

  pasteCells: (state: INotebook, { payload }: IPasteCellPayload): void => {
    const selectedCell = state.selectedCell;
    const { position } = payload;

    if (selectedCell !== null) {
      const cellIndex = getCellIndex(state, selectedCell);

      if (cellIndex !== undefined && state.clipboard.cells.length > 0) {
        if (position === "bottom") {
          state.cells.splice(cellIndex + 1, 0, ...state.clipboard.cells);
        } else {
          state.cells.splice(cellIndex, 0, ...state.clipboard.cells);
        }

        // if the context is cut, empty the clipboard
        if (state.clipboard.context === "cut") {
          state.clipboard = {
            context: null,
            cells: [],
          };
        } else {
          // refresh new ids
          state.clipboard = {
            context: "copy",
            cells: state.clipboard.cells.map((cell) => ({
              ...cell,
              id: uniqid(),
            })),
          };
        }
      }
    }
  },

  setClipboardCells: (
    state: INotebook,
    { payload }: ISetClipboardCellPayload
  ): void => {
    const { cells, context } = payload;

    if (Array.isArray(cells)) {
      state.clipboard = {
        cells,
        context,
      };
    }
  },

  addCellsToQueue: (
    state: INotebook,
    { payload }: IAddCellsToQueuePayload
  ): void => {
    state.executionQueue = state.executionQueue.concat(...payload.cellIds);
  },
  removeCellFromQueue: (state: INotebook): void => {
    console.log("removing cell from queue", state.executionQueue[0]);
    state.executionQueue.shift();
  },
  addCellsAfterCellToQueue: (state: INotebook, { payload }: any): void => {
    const { cellId } = payload;
    let startIndex: number | undefined = 0;

    if (cellId) {
      startIndex = getCellIndex(state, cellId);

      if (startIndex === undefined) {
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
