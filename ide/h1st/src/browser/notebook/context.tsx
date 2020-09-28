import * as React from "react";

type INotebookContext = {
  saveNotebook: Function;
  getAutoCompleteItems: Function;
  executeQueue: Function;
};

const defaultValue: INotebookContext = {
  saveNotebook: () => console.log("default save notebook"),
  getAutoCompleteItems: () => console.log("default autocoplete"),
  executeQueue: () => console.log("default execute"),
};

const NotebookContext = React.createContext(defaultValue);
export const NotebookContextProvider = NotebookContext.Provider;
export default NotebookContext;
