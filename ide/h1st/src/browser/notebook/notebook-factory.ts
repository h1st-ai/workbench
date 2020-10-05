import { DEFAULT_CELL } from "./defaults";
import { ICellModel } from "./types";

const uniqid = require("uniqid");

export class NotebookFactory {
  static initializeMonacoEditorSetting(provideCompletionItems: any) {
    monaco.languages.registerCompletionItemProvider("python", {
      provideCompletionItems,
    });
  }
  static makeNewCell(): ICellModel {
    // @ts-ignore
    return {
      ...DEFAULT_CELL,
      id: uniqid(),
    };
  }
}
