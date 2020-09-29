import * as React from "react";
import {
  Message,
  NavigatableWidget,
  // NavigatableWidget,
  // Navigatable,
  ReactWidget,
  Widget,
  // Saveable,
  SaveableSource,
  Saveable,
  // StatefulWidget,
  // ReactRenderer,
} from "@theia/core/lib/browser";
import { injectable } from "inversify";
import URI from "@theia/core/lib/common/uri";
import { MessageService, Resource, SelectionService } from "@theia/core";
import { FileService } from "@theia/filesystem/lib/browser/file-service";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Notebook from "./components/notebook";
// import Icon from "./components/icon";
import reducer from "./reducers";
import { notebookActions } from "./reducers/notebook";
import { INotebookContext } from "./types";
import { ThemeService } from "@theia/core/lib/browser/theming";
import { H1stBackendWithClientService } from "../../common/protocol";
import NotebookContext from "./context";
import { NotebookModel } from "./notebook-model";
import { NotebookManager } from "./notebook-manager";

const equal = require("fast-deep-equal");

@injectable()
export class H1stNotebookWidget extends ReactWidget
  implements SaveableSource, NavigatableWidget {
  static readonly ID = "h1st:notebook:widget";
  private readonly store: any;
  private _width: number;
  private _height: number;
  private _initialized: Boolean = false;
  private _model: NotebookModel;
  private notebookManager: NotebookManager;

  constructor(
    readonly uri: URI,
    protected readonly selectionService: SelectionService,
    protected readonly fileService: FileService,
    protected readonly themeService: ThemeService,
    protected readonly messageService: MessageService,
    protected readonly h1stBackendClient: H1stBackendWithClientService
  ) {
    super();
    this.store = configureStore({ reducer, devTools: true });
    // this.store.subscribe(this.onStoreChange);

    const resource: Resource = {
      uri,
      readContents: this.readNotebookContent,
      saveContents: this.saveNotebook,
      dispose: this.dispose,
    };
    this._model = new NotebookModel(resource);
    this.setTheme();

    this.notebookManager = new NotebookManager(
      uri,
      this._model,
      this.store,
      this.h1stBackendClient,
      this.messageService
    );
  }

  onStoreChange = () => {
    const content = this.store.getState();

    if (this._initialized && content) {
      console.log(
        "comparing",
        content.notebook.cells,
        this._model.value.cells,
        equal(content.notebook.cells, this._model.value.cells)
      );
      if (!equal(content.notebook.cells, this._model.value.cells)) {
        this._model.update(content.notebook);
      }
    }
  };

  private readNotebookContent = async () =>
    await this.h1stBackendClient.getFileContent(this.uri.path.toString());

  private saveNotebook = async (content: string) => {
    console.log("saving content");

    await this.fileService.write(this.uri, content);
    this._model.dirty = false;
  };

  get saveable(): Saveable {
    return this._model;
  }

  private async setTheme() {
    const { setActiveTheme } = notebookActions;

    const {
      id,
      type,
      label,
      description,
      editorTheme,
    } = this.themeService.getCurrentTheme();

    await this.store.dispatch(
      setActiveTheme({
        id,
        type,
        label,
        description,
        editorTheme,
      })
    );
  }

  // get onDispose(): Event<void> {
  //   return this.toDispose.onDispose;
  // }

  // get saveable(): Saveable {
  //   return this.editor.document;
  // }

  // storeState(): object {
  //   return {};
  // }

  // restoreState(oldState: object): void {
  //   console.log("restoring state", oldState);
  // }

  getResourceUri(): URI | undefined {
    return this.uri;
  }
  createMoveToUri(resourceUri: URI): URI | undefined {
    return new URI("test2");
  }

  protected onResize(msg: Widget.ResizeMessage): void {
    const { width, height } = msg;
    this._width = width;
    this._height = height;
    this.update();
  }

  protected async initContentFromNotebook() {
    console.log("loading file content", this.uri.toString());
    await this._model.load();
  }

  protected async init() {
    await this.initContentFromNotebook();
    const { setCells } = notebookActions;
    this.store.dispatch(setCells({ cells: this._model.value.cells }));

    await this.notebookManager.init();

    // mark this widget as initialized
    this._initialized = true;

    this.update();
  }

  protected async onAfterAttach(msg: Message): Promise<void> {
    super.onAfterAttach(msg);
    if (this.isVisible && !this._initialized) {
      await this.init();
    } else {
      this.update();
    }
  }

  protected async onActivateRequest(msg: Message) {
    super.onActivateRequest(msg);
    console.log("activated", msg, this.uri);

    if (!this._initialized) {
      await this.init();
    } else {
      this.update();
    }
  }

  protected render(): React.ReactNode {
    const contextValue: INotebookContext = {
      saveNotebook: this.saveNotebook,
      manager: this.notebookManager,
      width: this._width,
      height: this._height,
    };

    return (
      <NotebookContext.Provider value={contextValue}>
        <Provider store={this.store}>
          <Notebook uri={this.uri} model={this._model.value} />
        </Provider>
      </NotebookContext.Provider>
    );
  }
}
