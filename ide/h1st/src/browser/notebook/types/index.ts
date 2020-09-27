import { ThemeType } from "@theia/core/lib/browser/theming";

export interface ICell {}

export interface Theme {
  readonly id: string;
  readonly type: ThemeType;
  readonly label: string;
  readonly description?: string;
  readonly editorTheme?: string;
}

export interface INotebook {
  cells: ICellModel[];
  selectedCell: string | null;
  activeCell: string | null;
  activeTheme: Theme | null;
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

export interface ICellOutputError {
  output_type: string;
  ename: string;
  evalue: string;
  traceback: string[];
}

export interface ICellModel {
  source: string[];
  cell_type: "markdown" | "code" | "raw";
  metadata: any;
  id?: string;
  outputs: any[];
  execution_count?: number;
}

export interface ICellOutputProps {
  model: ICellModel;
}

export enum CELL_TYPE {
  MD = "markdown",
  CODE = "code",
  RAW = "raw",
}
