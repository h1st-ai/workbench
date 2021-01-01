export interface IFile {
  uri: string;
  displayInfo: any;
}

export interface IDefaultLayout {
  files: IFile[];
}

export interface INotebookServerInit {
  cache: string;
  credentials: string;
}

export interface INotebookServerConfig {
  baseUrl: string;
  appUrl: string;
  wsUrl: string;
  token: string;
  init?: INotebookServerInit;
  cache: string;
  credentials: string;
}

export interface ICellCodeInfo {
  code: string;
  type: string;
}

export interface ICellCompletionResponse {
  cursor_start: number;
  cursor_end: number;
  matches: string[];
}
