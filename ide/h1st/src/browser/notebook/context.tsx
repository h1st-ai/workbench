import * as React from "react";

type INotebookContext = {
  saveNotebook: Function;
  getAutoCompleteItems: Function;
};

const defaultValue: INotebookContext = {
  saveNotebook: () => console.log("default save notebook"),
  getAutoCompleteItems: () => console.log("default autocoplete"),
};

const NotebookContext = React.createContext(defaultValue);
export const NotebookContextProvider = NotebookContext.Provider;
export default NotebookContext;
