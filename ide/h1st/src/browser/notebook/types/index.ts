export interface ICell {
  cell_type: string;
  execution_count: number | null;
  metadata: any;
  source: string[];
  outputs: string[];
}

export interface INotebook {
  cells: ICell[];
}

export interface IKernel {
  currentKernel: string | undefined;
  connectionStatus: string;
  status: string;
}

export interface IStore {
  kernel: IKernel;
  notebook: INotebook;
}
