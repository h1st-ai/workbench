export type IFile = {
  uri: string;
  displayInfo: any;
};

export type IDefaultLayout = {
  files: IFile[];
};

export type INotebookServerInit = {
  cache: string;
  credentials: string;
};

export type INotebookServerConfig = {
  baseUrl: string;
  appUrl: string;
  wsUrl: string;
  token: string;
  init?: INotebookServerInit;
  cache: string;
  credentials: string;
};
