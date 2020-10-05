import { ICellModel } from ".";

export interface ICutCellPayload {
  payload: {
    cellIds: string[];
  };
}

export interface ISetClipboardCellPayload {
  payload: {
    cells: ICellModel[];
    context: "cut" | "copy";
  };
}

export interface IPasteCellsPayload {
  payload: {
    cellId: string;
    cells: ICellModel[];
  };
}
