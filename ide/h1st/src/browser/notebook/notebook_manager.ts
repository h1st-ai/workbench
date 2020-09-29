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
import { MessageService } from "@theia/core";
import { H1stBackendWithClientService } from "../../common/protocol";
import { NotebookModel } from "./notebook-model";
import { notebookActions } from "./reducers/notebook";
import { kernelActions } from "./reducers/kernel";
import URI from "@theia/core/lib/common/uri";
import { ApplicationLabels } from "./labels";
import { INotebook } from "./types";

export class NotebookManager {
  private _kernelManager: KernelManager;
  private _kernelSpecManager: KernelSpecManager;
  private _kernelSpecs: ISpecModels | null;
  private _session: Session.ISessionConnection;
  private _sessionManager: SessionManager;
  private _serverSettings: ServerConnection.ISettings;

  constructor(
    readonly uri: URI,
    protected readonly model: NotebookModel,
    protected readonly store: any,
    protected readonly h1stBackendClient: H1stBackendWithClientService,
    protected readonly messageService: MessageService
  ) {}

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
      // Fire when kernel changed. Eg: server goes down and up again
      this._session.kernelChanged.connect(async (_, val) => {
        console.log("Session kernel changed", val);
        await this.createOrRestoreJupyterSession();
        await this.initializeKernelEventHandler();
      });

      // The kernel statusChanged signal, proxied from the current kernel.
      this._session.statusChanged.connect((_, status) => {
        this.messageService.warn("Session connect status changed");
        console.log("Session connect status changed", status);
        this.setCurrentKernelStatus(status);
      });

      this._session.statusChanged.disconnect((_, status) => {
        console.log("Session disconnect status changed", status);
        this.setCurrentKernelStatus(status);
      });

      this._session.connectionStatusChanged.connect((_, status) => {
        console.log("Session connect status changed", status);
        this.setCurrentKernelConnectionStatus(status);
      });

      this._session.connectionStatusChanged.disconnect((_, status) => {
        this.messageService.error(
          "Session disconnect status changed",
          "OK",
          "Reconnect"
        );

        this.setCurrentKernelConnectionStatus(status);
      });
    }
  }

  private setCurrentKernelStatus(status: string) {
    const { setKernelStatus } = kernelActions;

    this.store.dispatch(setKernelStatus(status));
  }

  private setCurrentKernelConnectionStatus(status: string) {
    const { setKernelConnectionStatus } = kernelActions;

    this.store.dispatch(setKernelConnectionStatus(status));
  }

  // protected async reconnect(): Promise<void> {
  //   try {
  //     if (this._session) {
  //       this._session.c
  //     }
  //   } catch (error) {

  //   }
  // }

  protected async createOrRestoreJupyterSession(): Promise<void> {
    try {
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

      if (this._session && this._session.kernel) {
        // reconnect if disconncted
        if (this._session.kernel.connectionStatus !== "disconnected") {
          this._session.kernel.reconnect();
        }

        const { setKernelInfo } = kernelActions;

        this.store.dispatch(
          setKernelInfo({
            kernel: this._kernelSpecs?.kernelspecs[this._session.kernel?.name],
          })
        );
      }
    } catch (ex) {
      this.messageService.error("Cannot initialize kernel", "OK");
      console.log("Cannot initialize kernel", ex);
    }
  }

  protected async initializeNewSession(): Promise<Session.ISessionConnection> {
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

  async interrupKernel() {
    console.log("restarting Kernel");

    const answer = await this.messageService.info(
      ApplicationLabels.KERNEL.MSG_RESTART,
      "No",
      "Yes"
    );
    if (answer === "Yes") {
      if (this._session.kernel) {
        try {
          await this._session.kernel.restart();
          this.messageService.info(
            ApplicationLabels.KERNEL.MSG_RESTART_SUCCESS,
            { timeout: 4000 }
          );
        } catch (ex) {
          this.messageService.error(
            ApplicationLabels.KERNEL.MSG_RESTART_FAILURE
          );
        }
      }
    }
  }

  restartKernel = async () => {
    console.log("restarting Kernel");

    const answer = await this.messageService.info(
      ApplicationLabels.KERNEL.MSG_RESTART,
      "No",
      "Yes"
    );
    if (answer === "Yes") {
      if (this._session.kernel) {
        try {
          await this._session.kernel.restart();
          this.messageService.info(
            ApplicationLabels.KERNEL.MSG_RESTART_SUCCESS,
            { timeout: 4000 }
          );
        } catch (ex) {
          this.messageService.error(
            ApplicationLabels.KERNEL.MSG_RESTART_FAILURE
          );
        }
      }
    }
  };

  executeQueue = async () => {
    const state = this.store.getState();

    // const kernelStatus = state.kernel.status;
    const exeQueue = state.kernel.executionQueue;

    if (exeQueue.length > 0) {
      console.log("execute next cell");

      let code = null;
      let cellId = exeQueue[0];
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
      const { updateCellOutput, clearCellOutput } = notebookActions;
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
        // await this.store.dispatch(updateCellExecutionCount({ cellId }));
      };

      await future.done;
    }
  };

  private getSourceCodeFromId(cellId: string, state: INotebook): string | null {
    for (let i = 0; i < state.cells.length; i++) {
      if (cellId === state.cells[i].id) {
        return state.cells[i].source.join("\n");
      }
    }

    return null;
  }

  async getAutoCompleteItems(
    code: string | undefined,
    cursor_pos: number
  ): Promise<string[] | null> {
    if (!code) {
      return [];
    }

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
  }

  async init() {
    await this.initializeServerSettings();
    this.initializeKernelManager();
    this.initializeSessionManager();

    await this.initializeKernelSpecsManager();
    await this.createOrRestoreJupyterSession();

    await this.initializeKernelEventHandler();
  }
}
