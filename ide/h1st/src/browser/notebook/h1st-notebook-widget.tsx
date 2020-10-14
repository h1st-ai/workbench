import * as React from "react";
import {
  Message,
  NavigatableWidget,
  ReactWidget,
  Widget,
  SaveableSource,
  Saveable,
  SaveableWidget,
  ShouldSaveDialog,
  setDirty,
  Key,
  KeyCode,
  KeyModifier,
} from "@theia/core/lib/browser";
import { MAIN_MENU_BAR, Command } from "@theia/core/lib/common";
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

export namespace NotebookMenu {
  export const NOTEBOOK = [...MAIN_MENU_BAR, "7_notebook"];
  export const NOTEBOOK_KERNEL_SUBMENU = [...NOTEBOOK, "1_notebook_submenu"];
  export const FILE_SETTINGS_SUBMENU_OPEN = [
    ...NOTEBOOK_KERNEL_SUBMENU,
    "1_notebook_submenu_kernel",
  ];
}

export namespace NotebookCommand {
  export const RestartKernelAndRunAll: Command = {
    id: "h1st.notebook.kernel.restartAndRun",
    label: "Restart And Run",
  };
}

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
  private _pendingKeys: Key | undefined;
  private PENDING_KEY_DELAY = 300;

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

  get manager(): NotebookManager {
    return this.notebookManager;
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
      // if there is no cells, initialize one
      if (content.notebook.cells.length === 0) {
        this.notebookManager.ensureCellInNotebook();
      }

      // update the model
      if (!equal(content.notebook.cells, this._model.value.cells)) {
        this._model.update(content.notebook);
        this.notebookManager.setDirty(true);
      }
    }
  };

  save() {
    this._model.save();
  }

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

    const events = [
      /**
       * Cmd/Ctrl + Enter to run current cell. Important: if you have an
       * async funciton, make sure it has an await operation or the event
       * won't propagate.
       *
       * In short, the function must return false for the event to propagate
       * to other listeners
       */

      /**
       * Listen to the enter keypress to enter edit mode
       */
      {
        key: KeyCode.createKeyCode({
          first: Key.ENTER,
          modifiers: [KeyModifier.CtrlCmd],
        }),
        handler: async (ev: KeyboardEvent) => {
          this.notebookManager.addSelectedCellToQueue();
          await this.notebookManager.executeQueue();
          await this.notebookManager.selectNextCell();

          // return false if you want the event to propagate
          return false;
        },
      },

      /**
       * Listen to the ENTER keypress to insert cell before selected cell
       */
      {
        key: Key.ENTER,
        handler: (ev: KeyboardEvent) => {
          if (this.isAnyCellFocused()) return false;

          this.notebookManager.enterEditMode();

          // return false if you want the event to propagate
          return false;
        },
      },

      /**
       * Listen to the A keypress to insert cell before the selected cell
       */
      {
        key: Key.KEY_A,
        handler: (ev: KeyboardEvent) => {
          if (this.isAnyCellFocused()) return false;

          this.notebookManager.insertCellAroundSelectedCell("before");
          this.notebookManager.setDirty(true);

          // return false if you want the event to propagate
          return false;
        },
      },

      /**
       * Listen to the B keypress to insert cell after the selected cell
       */
      {
        key: Key.KEY_B,
        handler: (ev: KeyboardEvent) => {
          if (this.isAnyCellFocused()) return false;

          this.notebookManager.insertCellAroundSelectedCell("after");
          this.notebookManager.setDirty(true);

          // return false if you want the event to propagate
          return false;
        },
      },

      /**
       * Listen to the X keypress to select the next cell of the currently selected cell
       */
      {
        key: Key.KEY_C,
        handler: (ev: KeyboardEvent) => {
          if (this.isAnyCellFocused()) return false;
          this.notebookManager.copyCells();

          // return false if you want the event to propagate
          return false;
        },
      },

      /**
       * Listen to the B keypress to insert cell after the selected cell
       */
      {
        key: Key.KEY_D,
        handler: (ev: KeyboardEvent) => {
          console.log("this.isAnyCellFocused()", this.isAnyCellFocused());
          if (this.isAnyCellFocused()) {
            return false;
          }

          // the behavior is doubling press D within 400ms to activate
          // on the first keystroke, we store the pending key
          if (!this._pendingKeys) {
            this.setPendingKey(Key.KEY_D);
            return false;
          }

          // on the second key stroke, we're gonna delete the cell
          this.notebookManager.deleteSelectedCell();
          // this.notebookManager.setDirty(true);

          // return false if you want the event to propagate
          return false;
        },
      },

      /**
       * Listen to the X keypress to select the next cell of the currently selected cell
       */
      {
        key: Key.KEY_O,
        handler: (ev: KeyboardEvent) => {
          if (this.isAnyCellFocused()) return false;
          this.notebookManager.toggleSelectedCellOutputs();

          // return false if you want the event to propagate
          return false;
        },
      },

      /**
       * Listen to the L keypress to select the next cell of the currently selected cell
       */
      {
        key: Key.KEY_L,
        handler: (ev: KeyboardEvent) => {
          if (this.isAnyCellFocused()) return false;
          this.notebookManager.toggleCellLineNumber();

          // return false if you want the event to propagate
          return false;
        },
      },

      /**
       * Listen to the V keypress to select the next cell of the currently selected cell
       */
      {
        key: KeyCode.createKeyCode({
          first: Key.KEY_V,
          modifiers: [KeyModifier.SHIFT],
        }),
        handler: (ev: KeyboardEvent) => {
          if (this.isAnyCellFocused()) return false;

          this.notebookManager.pasteCells("top");
          this.notebookManager.setDirty(true);

          // return false if you want the event to propagate
          return false;
        },
      },
      {
        key: Key.KEY_V,
        handler: (ev: KeyboardEvent) => {
          if (this.isAnyCellFocused()) return false;

          this.notebookManager.pasteCells("bottom");
          this.notebookManager.setDirty(true);

          // return false if you want the event to propagate
          return false;
        },
      },
      /**
       * Listen to the X keypress to select the next cell of the currently selected cell
       */
      {
        key: Key.KEY_X,
        handler: (ev: KeyboardEvent) => {
          if (this.isAnyCellFocused()) return false;

          this.notebookManager.cutCells();
          this.notebookManager.setDirty(true);

          // return false if you want the event to propagate
          return false;
        },
      },
      {
        key: Key.KEY_Z,
        handler: (ev: KeyboardEvent) => {
          if (this.isAnyCellFocused()) return false;

          this.notebookManager.undoDeleteCell();
          this.notebookManager.setDirty(true);

          // return false if you want the event to propagate
          return false;
        },
      },

      /**
       * Listen to the arrow keypress to select the next cell of the currently selected cell
       */
      {
        key: Key.ARROW_DOWN,
        handler: (ev: KeyboardEvent) => {
          if (this.isAnyCellFocused()) return false;

          this.notebookManager.selectNextCell();

          // return false if you want the event to propagate
          return false;
        },
      },

      /**
       * Listen to the arrow keypress to select the next cell of the currently selected cell
       */
      {
        key: Key.ARROW_UP,
        handler: (ev: KeyboardEvent) => {
          if (this.isAnyCellFocused()) return false;

          this.notebookManager.selectPrevCell();

          // return false if you want the event to propagate
          return false;
        },
      },
    ];

    events.forEach((event) => {
      this.addKeyListener(this.node, event.key, event.handler);
    });
  }

  protected isAnyCellFocused(): boolean {
    return this.store.getState().notebook.activeCell;
  }

  protected setPendingKey(key: Key) {
    this._pendingKeys = key;

    // clear it after PENDING_KEY_DELAY;
    setTimeout(() => {
      this._pendingKeys = undefined;
    }, this.PENDING_KEY_DELAY);
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

    this.node.focus();
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
