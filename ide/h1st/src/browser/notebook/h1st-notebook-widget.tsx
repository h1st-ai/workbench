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
  SaveableWidget,
  ShouldSaveDialog,
  setDirty,
  Key,
  KeyCode,
  KeyModifier,
  // StatefulWidget,
  // ReactRenderer,
} from "@theia/core/lib/browser";
import { injectable } from "inversify";
import URI from "@theia/core/lib/common/uri";
import { MessageService, SelectionService } from "@theia/core";
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
  implements SaveableSource, NavigatableWidget, SaveableWidget {
  static readonly ID = "h1st:notebook:widget";
  private readonly store: any;
  private _width: number;
  private _height: number;
  private _initialized: Boolean = false;
  private _model: NotebookModel;
  private notebookManager: NotebookManager;
  private CSS_CLASS: string = "h1st-notebook-widget";

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
    this.store.subscribe(this.onStoreChange);

    this.node.classList.add(this.CSS_CLASS);
    // this is important so that we can bind event handlers to the widget
    this.node.setAttribute("tabindex", "0");

    this._model = new NotebookModel(
      this.uri,
      this.fileService,
      this.h1stBackendClient
    );
    this._model.onNotebookContentLoad(() => this.onContentLoad());
    this._model.onDirtyChanged(() => this.onDirtyChange());
    this.setTheme();

    this.notebookManager = new NotebookManager(
      this,
      uri,
      this._model,
      this.store,
      this.h1stBackendClient,
      this.messageService
    );

    this.initCommandShortcuts();
  }

  private onDirtyChange() {
    setDirty(this, this._model.dirty);
  }

  private async onContentLoad() {
    if (this.isVisible) {
      if (!this._initialized) {
        await this.init();
      }

      this.update();
    }
  }

  async closeWithoutSaving() {
    this.dispose();
  }

  async closeWithSaving() {
    this._model.save();
    this.dispose();
  }

  async onCloseRequest(msg: Message) {
    if (Saveable.isDirty(this)) {
      const dialog = new ShouldSaveDialog(this);
      const future = dialog.open();

      if (future) {
        const shouldSave = await future;
        dialog.close();

        console.log("shouldSave", shouldSave);

        switch (shouldSave) {
          case true:
            this.closeWithSaving();
            break;

          case false:
            this.closeWithoutSaving();
            super.onCloseRequest(msg);
            break;

          default:
            this.activate();
            break;
        }
      }
    } else {
      super.onCloseRequest(msg);
    }
  }

  onStoreChange = () => {
    const content = this.store.getState();

    if (this._initialized && content) {
      // console.log(
      //   equal(content.notebook.cells, this._model.value.cells)
      // );

      if (!equal(content.notebook.cells, this._model.value.cells)) {
        this._model.update(content.notebook);
        this.notebookManager.setDirty(true);
      }
    }
  };

  // private readNotebookContent = async () =>
  //   await this.h1stBackendClient.getFileContent(this.uri.path.toString());

  private saveNotebook = async (content: string) => {
    console.log("saving content");

    // await this.fileService.write(this.uri, content);
    this.notebookManager.setDirty(false);
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
    return resourceUri;
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

  protected initCommandShortcuts() {
    console.log("Initializing command shortcuts");
    // Cmd/Ctrl + Enter to run current cell
    this.addKeyListener(
      this.node,
      KeyCode.createKeyCode({
        first: Key.ENTER,
        modifiers: [KeyModifier.CtrlCmd],
      }),
      async (ev: KeyboardEvent) => {
        this.notebookManager.addSelectedCellToQueue();
        await this.notebookManager.executeQueue();

        // return false if you want the event to propagate
        return false;
      }
    );

    this.addKeyListener(this.node, Key.ENTER, (ev: KeyboardEvent) => {
      this.notebookManager.enterEditMode();

      // return false if you want the event to propagate
      return false;
    });
  }

  protected async init() {
    console.log("inittialize widget ", this.uri.toString());
    await this.initContentFromNotebook();
    const { setCells } = notebookActions;
    this.store.dispatch(setCells({ cells: this._model.value.cells }));

    await this.notebookManager.init();

    // mark this widget as initialized
    this._initialized = true;

    this.update();
  }

  protected async onAfterAttach(msg: Message): Promise<void> {
    if (this.isVisible) {
      if (!this._initialized) await this.init();

      this.update();
    }

    super.onAfterAttach(msg);
  }

  protected async onActivateRequest(msg: Message) {
    super.onActivateRequest(msg);

    if (!this._initialized) {
      await this.init();
    } else {
      this.update();
    }
    setTimeout(() => this.update(), 0);
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
