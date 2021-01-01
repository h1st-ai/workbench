import { ICellModel, ICellType } from ".";

export interface ICutCellPayload {
  payload: {
    cellIds?: string[];
  };
}

export interface ISetClipboardCellPayload {
  payload: {
    cells: ICellModel[];
    context: "cut" | "copy";
  };
}

export interface IPasteCellPayload {
  payload: {
    position: "top" | "bottom";
  };
}

export interface ISetActiveCellPayload {
  payload: {
    cellId: string | null;
  };
}

export interface IAddCellsToQueuePayload {
  payload: {
    cellIds: string[];
  };
}

export interface ISetCellsTypePayload {
  payload: {
    cellIds: string[];
    type: ICellType;
  };
}

export interface IDeleteCellsPayload {
  payload: {
    cellIds: string[];
  };
}

export interface IToggleActionOverlayPayload {
  payload: {
    show?: boolean;
  };
}

export interface IToggleCellOutputPayload {
  payload: {
    cellIds: string[];
    show: boolean;
  };
}
