export interface ICell {
  input: {
    code: string;
  };
  output: {
    value: string;
  };
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
