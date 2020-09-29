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

import {
  // KernelAPI,
  KernelManager,
  KernelSpecManager,
  KernelMessage,
  // Kernel,
  SessionManager,
  Session,
  // SessionAPI,
  ServerConnection,
} from "@jupyterlab/services";

import { ISpecModels } from "@jupyterlab/services/lib/kernelspec/restapi";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Notebook from "./components/notebook";
// import Icon from "./components/icon";
import reducer from "./reducers";
import { notebookActions } from "./reducers/notebook";
import { kernelActions } from "./reducers/kernel";
import { INotebook, INotebookContext } from "./types";
import { ThemeService } from "@theia/core/lib/browser/theming";
import { H1stBackendWithClientService } from "../../common/protocol";
import NotebookContext from "./context";
import { NotebookModel } from "./notebook-model";

const equal = require("fast-deep-equal");

@injectable()
export class H1stNotebookWidget extends ReactWidget
  implements SaveableSource, NavigatableWidget {
  static readonly ID = "h1st:notebook:widget";
  private readonly store: any;
  private _width: number;
  private _height: number;
  // private _kernel: Kernel.IKernelConnection;
  private _kernelManager: KernelManager;
  private _kernelSpecManager: KernelSpecManager;
  private _kernelSpecs: ISpecModels | null;
  private _session: Session.ISessionConnection;
  private _sessionManager: SessionManager;
  private _serverSettings: ServerConnection.ISettings;
  private _initialized: Boolean = false;
  private _model: NotebookModel;

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

    const resource: Resource = {
      uri,
      readContents: this.readNotebookContent,
      saveContents: this.saveNotebook,
      dispose: this.dispose,
    };
    this._model = new NotebookModel(resource);
    this.setTheme();
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

  private getSourceCodeFromId(cellId: string, state: INotebook): string | null {
    for (let i = 0; i < state.cells.length; i++) {
      if (cellId === state.cells[i].id) {
        return state.cells[i].source.join("");
      }
    }

    return null;
  }

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

  private setCurrentKernelStatus(status: string) {
    const { setKernelStatus } = kernelActions;

    this.store.dispatch(setKernelStatus(status));
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
    // this.update();
  }

  protected async initializeServerSettings(): Promise<void> {
    console.log("Initializing server settings");
    let FETCH: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
    let HEADERS: typeof Headers;
    let REQUEST: typeof Request;
    let WEBSOCKET: typeof WebSocket;

    FETCH = fetch;
    REQUEST = Request;
    HEADERS = Headers;
    WEBSOCKET = WebSocket;

    // get the server config from the backend
    const serverConfig = await this.h1stBackendClient.getNotebookServerConfig();

    // intialize jupyter server settings
    this._serverSettings = {
      ...serverConfig,
      init: {
        // @ts-ignore
        cache: serverConfig.cache,
        // @ts-ignore
        credentials: serverConfig.credentials,
      },
      fetch: FETCH,
      Headers: HEADERS,
      Request: REQUEST,
      WebSocket: WEBSOCKET,
    };
  }

  protected initializeKernelManager(): void {
    this._kernelManager = new KernelManager({
      serverSettings: this._serverSettings,
    });
  }

  protected initializeSessionManager(): void {
    this._sessionManager = new SessionManager({
      kernelManager: this._kernelManager,
      serverSettings: this._serverSettings,
    });
  }

  protected async initializeKernelSpecsManager(): Promise<void> {
    this._kernelSpecManager = new KernelSpecManager({
      serverSettings: this._serverSettings,
    });

    await this._kernelSpecManager.ready;
    this._kernelSpecs = this._kernelSpecManager.specs;
    console.log(`Default spec: ${this._kernelSpecs?.default}`);

    if (this._kernelSpecs) {
      console.log(
        `Available specs: ${Object.keys(this._kernelSpecs.kernelspecs)}`
      );
    }
  }

  protected async initializeKernelEventHandler(): Promise<void> {
    if (this._session && this._session.kernel) {
      this._sessionManager.runningChanged.connect((_, status) => {
        // this.setCurrentKernelStatus(status);
        this.messageService.warn(`Kernel status: ${JSON.stringify(status)}`);
      });

      this._session.kernel.statusChanged.disconnect((_, status) => {
        this.setCurrentKernelStatus(status);
        this.messageService.warn(`Kernel disconnect: ${status}`);
      });
    }
  }

  protected async initializeNewSession(): Promise<Session.ISessionConnection> {
    // const kernelModels = await KernelAPI.listRunning(this._serverSettings);
    // console.log("Available Kernels", kernelModels);

    const options: Session.ISessionOptions = {
      kernel: {
        name: "python",
      },
      path: this.uri.path.toString(),
      type: "notebook",
      name: this.uri.path.base,
    };

    return await this._sessionManager.startNew(options);
  }

  protected async createOrRestoreJupyterSession(): Promise<void> {
    try {
      const sessionId = this._model.value.metadata.session_id;
      if (sessionId) {
        const sessionModel = await this._sessionManager.findByPath(
          this.uri.path.toString()
        );

        if (sessionModel) {
          this._session = this._sessionManager.connectTo({
            model: sessionModel,
          });

          if (this._session.kernel) {
            this.messageService.info(
              `Resumed last kernel session: ${
                this._kernelSpecs?.kernelspecs[this._session.kernel?.name]
                  ?.display_name
              }`,
              { timeout: 3000 }
            );
          }
        }
      }

      // if we can't find the session id or session id on the notebook is null then create a new one
      if (!this._session) {
        this._session = await this.initializeNewSession();

        if (this._session.kernel) {
          this.messageService.info(
            `Connected to new kernel: ${
              this._kernelSpecs?.kernelspecs[this._session.kernel?.name]
                ?.display_name
            }`,
            { timeout: 3000 }
          );
        }
      }

      if (this._session && this._session.kernel) {
        const { setKernelInfo } = kernelActions;

        this.store.dispatch(
          setKernelInfo({
            kernel: this._kernelSpecs?.kernelspecs[this._session.kernel?.name],
          })
        );
      }
    } catch (ex) {
      this.messageService.warn("Cannot initialize kernel");
      console.log("Cannot initialize kernel", ex);
    }
  }

  protected async initNotebookServices(): Promise<void> {
    await this.initializeServerSettings();
    this.initializeKernelManager();
    this.initializeSessionManager();

    await this.initializeKernelSpecsManager();
    await this.initializeKernelEventHandler();
  }

  protected async initContentFromNotebook() {
    console.log("loading file content", this.uri.toString());
    await this._model.load();

    // const content = await this.fileService.readFile(this.uri);
    // const content = await this.h1stBackendClient.readFile(
    //   this.uri.path.toString()
    // );
  }

  protected async init() {
    await this.initNotebookServices();
    await this.initContentFromNotebook();

    const { setCells } = notebookActions;
    this.store.dispatch(setCells({ cells: this._model.value.cells }));
    this.initializeKernelEventHandler();
    this.createOrRestoreJupyterSession();

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

  protected getAutoCompleteItems = async (
    code: string,
    cursor_pos: number
  ): Promise<string[] | null> => {
    console.log("Request autocomplete");
    const request: KernelMessage.ICompleteRequestMsg["content"] = {
      code,
      cursor_pos,
    };
    const inspectReply = await this._session.kernel?.requestComplete(request);

    if (inspectReply?.content.status === "ok") {
      console.log(
        "Inspect reply:",
        JSON.stringify(inspectReply?.content, null, 2)
      );

      return inspectReply?.content.matches;
    }

    return null;
  };

  private restartKernel = async () => {
    console.log("restarting Kernel");

    const answer = await this.messageService.info(
      "Do you want to restart the current kernel? All variables will be lost.",
      "No",
      "Yes"
    );
    if (answer === "Yes") {
      if (this._session.kernel) {
        await this._session.kernel.restart();
        this.messageService.info("Kernel restarted", { timeout: 4000 });
      }
    }
  };

  private executeQueue = async () => {
    const state = this.store.getState();

    // const kernelStatus = state.kernel.status;
    const exeQueue = state.kernel.executionQueue;

    if (exeQueue.length > 0) {
      console.log("execute next cell");

      let code = null,
        cellId = exeQueue[0];
      code = this.getSourceCodeFromId(cellId, state.notebook);

      if (code) {
        await this.executeCodeCell(code, cellId);
        // remove the first cell from queue

        await this.executeQueue();
      }
    }
  };

  protected executeCodeCell = async (code: string, cellId: string) => {
    if (code.trim() === "") {
      return;
    }

    if (this._session.kernel) {
      const {
        updateCellOutput,
        clearCellOutput,
        updateCellExecutionCount,
      } = notebookActions;
      const { setKernelStatus } = kernelActions;

      console.log("Executing code", this._session.kernel.status);
      // if (this._session.kernel.status !== "idle") {
      //   this.messageService.warn("Kernel is not ready");
      //   console.log("Kernel is not ready", this._session.kernel.status);
      //   return;
      // }

      await this.store.dispatch(clearCellOutput({ cellId }));
      const future = this._session.kernel.requestExecute({
        code,
        store_history: true,
        // silent?: boolean | undefined;
        // store_history?: boolean | undefined;
        // user_expressions?: JSONObject | undefined;
        // allow_stdin?: boolean | undefined;
        // stop_on_error?: boolean | undefined;
      });

      // Handle iopub messages
      future.onIOPub = async (msg) => {
        console.log("Kernel io:", msg);
        if (msg.header.msg_type !== "status") {
          await this.store.dispatch(updateCellOutput({ cellId, output: msg }));
        } else {
          await this.store.dispatch(
            // @ts-ignore
            setKernelStatus(msg.content.execution_state)
          );
        }
      };

      future.onReply = async (msg) => {
        console.log("Execution completed", msg);
        const { removeCellFromQueue } = kernelActions;
        await this.store.dispatch(removeCellFromQueue());
        await this.store.dispatch(updateCellExecutionCount({ cellId }));
      };

      await future.done;
    }
  };

  protected render(): React.ReactNode {
    const contextValue: INotebookContext = {
      saveNotebook: this.saveNotebook,
      getAutoCompleteItems: this.getAutoCompleteItems,
      executeCodeCell: this.executeCodeCell,
      executeQueue: this.executeQueue,
      restartKernel: this.restartKernel,
    };

    return (
      <NotebookContext.Provider value={contextValue}>
        <Provider store={this.store}>
          <Notebook
            uri={this.uri}
            model={this._model.value}
            width={this._width}
            height={this._height}
          />
        </Provider>
      </NotebookContext.Provider>
    );
  }
}
