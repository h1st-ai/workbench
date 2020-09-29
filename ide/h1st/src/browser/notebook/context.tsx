import * as React from "react";
import { INotebookContext } from "./types";

const noop = () => console.log("noop");

const defaultValue: INotebookContext = {
  saveNotebook: noop,
  getAutoCompleteItems: noop,
  executeQueue: noop,
  restartKernel: noop,
  executeCodeCell: noop,
};

const NotebookContext = React.createContext(defaultValue);
export const NotebookContextProvider = NotebookContext.Provider;
export default NotebookContext;
