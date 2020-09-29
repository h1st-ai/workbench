import * as React from "react";
import { INotebookContext } from "./types";

const noop = () => console.log("noop");

const defaultValue: INotebookContext = {
  saveNotebook: noop,
  manager: null,
  width: 0,
  height: 0,
};

const NotebookContext = React.createContext(defaultValue);
export const NotebookContextProvider = NotebookContext.Provider;
export default NotebookContext;
