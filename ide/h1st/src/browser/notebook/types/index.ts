export interface ICell {
  id?: string;
  cell_type: string;
  execution_count: number | null;
  metadata: any;
  source: string[];
  outputs: string[];
}

export interface INotebook {
  cells: ICell[];
  selectedCell: string | null;
  activeCell: string | null;
}

export interface INotebookWidget {
  width: number | null;
  height: number | null;
}

export interface IKernel {
  currentKernel: string | undefined;
  connectionStatus: string;
  status: string;
}

export interface IStore {
  kernel: IKernel;
  notebook: INotebook;
  widget: INotebookWidget;
}
