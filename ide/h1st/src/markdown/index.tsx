import * as React from "react";
import {
  Message,
  NavigatableWidget,
  ReactWidget,
  Widget,
  // SaveableSource,
  Saveable,
  SaveableWidget,
  ShouldSaveDialog,
  // setDirty,
} from "@theia/core/lib/browser";
import { injectable } from "inversify";
import URI from "@theia/core/lib/common/uri";
import { MessageService, SelectionService } from "@theia/core";
import { FileService } from "@theia/filesystem/lib/browser/file-service";

// import { Provider } from "react-redux";
// import { configureStore } from "@reduxjs/toolkit";

import { ThemeService } from "@theia/core/lib/browser/theming";
import { H1stBackendWithClientService } from "../common/protocol";

@injectable()
export class MardownEditorWidget extends ReactWidget
  implements NavigatableWidget, SaveableWidget {
  static readonly ID = "h1st:markdown:widget";
  // private readonly store: any;
  // private _width: number;
  // private _height: number;
  private _initialized: Boolean = false;
  private CSS_CLASS: string = "h1st-markdown-widget";

  constructor(
    readonly uri: URI,
    protected readonly selectionService: SelectionService,
    protected readonly fileService: FileService,
    protected readonly themeService: ThemeService,
    protected readonly messageService: MessageService,
    protected readonly h1stBackendClient: H1stBackendWithClientService
  ) {
    super();
    // this.store = configureStore({ reducer, devTools: true });
    // this.store.subscribe(this.onStoreChange);

    this.node.classList.add(this.CSS_CLASS);
    // this is important so that we can bind event handlers to the widget
    this.node.setAttribute("tabindex", "0");
  }

  // private onDirtyChange() {
  //   setDirty(this, this._model.dirty);
  // }

  // private async onContentLoad() {
  //   if (this.isVisible) {
  //     if (!this._initialized) {
  //       await this.init();
  //     }

  //     this.update();
  //   }
  // }

  async closeWithoutSaving() {
    this.dispose();
  }

  async closeWithSaving() {
    // this._model.save();
    this.dispose();
  }

  async onCloseRequest(msg: Message) {
    if (Saveable.isDirty(this)) {
      const dialog = new ShouldSaveDialog(this);
      const future = dialog.open();

      if (future) {
        const shouldSave = await future;
        dialog.close();

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

  // onStoreChange = () => {
  //   const content = this.store.getState();

  //   if (this._initialized && content) {
  //     // if there is no cells, initialize one
  //     if (content.notebook.cells.length === 0) {
  //       this.notebookManager.ensureCellInNotebook();
  //     }

  //     // update the model
  //     if (!equal(content.notebook.cells, this._model.value.cells)) {
  //       this._model.update(content.notebook);
  //       this.notebookManager.setDirty(true);
  //     }
  //   }
  // };

  // save() {
  //   this._model.save();
  // }

  // createSnapshot(): INotebookContent {
  //   return this._model.value;
  // }

  applySnapshot?(snapshot: object): void;

  // private = async (content: string) => {
  //   console.log("saving content");

  //   // await this.fileService.write(this.uri, content);
  //   this.notebookManager.setDirty(false);
  // };

  // get saveable(): Saveable {
  //   // return this._model;
  // }

  // private async setTheme() {
  //   const { setActiveTheme } = notebookActions;

  //   const {
  //     id,
  //     type,
  //     label,
  //     description,
  //     editorTheme,
  //   } = this.themeService.getCurrentTheme();

  //   await this.store.dispatch(
  //     setActiveTheme({
  //       id,
  //       type,
  //       label,
  //       description,
  //       editorTheme,
  //     })
  //   );
  // }

  getResourceUri(): URI | undefined {
    return this.uri;
  }
  createMoveToUri(resourceUri: URI): URI | undefined {
    return resourceUri;
  }

  protected onResize(msg: Widget.ResizeMessage): void {
    // const { width, height } = msg;
    // this._width = width;
    // this._height = height;
    this.update();
  }

  protected async initContentFromNotebook() {
    console.log("loading file content", this.uri.toString());
    // await this._model.load();
  }

  protected async init() {
    console.log("inittialize widget ", this.uri.toString());
    await this.initContentFromNotebook();

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

    this.node.focus();
  }

  protected render(): React.ReactNode {
    return <p>test</p>;
  }
}
