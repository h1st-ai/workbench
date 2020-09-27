import * as React from "react";
import {
  Message,
  NavigatableWidget,
  // NavigatableWidget,
  // Navigatable,
  ReactWidget,
  Widget,
  // Saveable,
  // SaveableSource,
  // StatefulWidget,
  // ReactRenderer,
} from "@theia/core/lib/browser";
import { injectable } from "inversify";
import URI from "@theia/core/lib/common/uri";
import { MessageService, SelectionService } from "@theia/core";
import { FileService } from "@theia/filesystem/lib/browser/file-service";
import nextId from "react-id-generator";
import {
  KernelAPI,
  KernelManager,
  // KernelMessage,
  // Kernel,
  SessionManager,
  Session,
  // SessionAPI,
  ServerConnection,
} from "@jupyterlab/services";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Notebook from "./components/notebook";
// import Icon from "./components/icon";
import reducer from "./reducers";
import { notebookActions } from "./reducers/notebook";
// import { kernelActions } from "./reducers/kernel";
import { ICellModel } from "./types";
import { ThemeService } from "@theia/core/lib/browser/theming";
import { H1stBackendWithClientService } from "../../common/protocol";

type INotebookContext = {
  saveNotebook: Function;
};

type INotebookContent = {
  cells: any[];
  metadata: {
    session_id?: string;
    kernelspec: {
      display_name: string;
      language: string;
      name: string;
    };
    language_info: {
      codemirror_mode: {
        name: string;
        version: number;
      };
      file_extension: string;
      mimetype: string;
      name: string;
      nbconvert_exporter: string;
      pygments_lexer: string;
      version: string;
    };
  };
  nbformat: number;
  nbformat_minor: number;
};

@injectable()
export class H1stNotebookWidget extends ReactWidget
  implements NavigatableWidget {
  static readonly ID = "h1st:notebook:widget";
  private readonly store: any;
  private _notebookFileContent: INotebookContent;
  private _width: number;
  private _height: number;
  // private _kernel: Kernel.IKernelConnection;
  private _context: React.Context<INotebookContext>;
  private _defaultContextValue: INotebookContext;
  private _kernelManager: KernelManager;
  private _session: Session.ISessionConnection;
  private _sessionManager: SessionManager;
  private _serverSettings: ServerConnection.ISettings;
  private _initialized: Boolean = false;

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
    this.setTheme();

    this._defaultContextValue = {
      saveNotebook: this.saveNotebook,
    };

    this._context = React.createContext<INotebookContext>(
      this._defaultContextValue
    );
  }

  private saveNotebook() {
    console.log("notebook save");
  }

  private setTheme() {
    const { setActiveTheme } = notebookActions;

    const {
      id,
      type,
      label,
      description,
      editorTheme,
    } = this.themeService.getCurrentTheme();

    this.store.dispatch(
      setActiveTheme({
        id,
        type,
        label,
        description,
        editorTheme,
      })
    );
  }

  // private setCurrentKernelStatus(status: string) {
  //   const { setKernelStatus } = kernelActions;

  //   this.store.dispatch(setKernelStatus(status));
  // }

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
      init: { cache: "no-store", credentials: "same-origin" },
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
    });
  }

  protected async initializeKernelEventHandler(): Promise<void> {
    // this._sessionManager.kernel.statusChanged.connect((_, status) => {
    //   this.setCurrentKernelStatus(status);
    // });
    // // Register a callback for when the kernel changes state.
    // this._sessionManager.kernel.statusChanged.disconnect((_, status) => {
    //   this.setCurrentKernelStatus(status);
    //   this.messageService.warn(`Kernel disconnect: ${status}`);
    // });
  }

  protected async initializeNewSession(): Promise<Session.ISessionConnection> {
    const kernelModels = await KernelAPI.listRunning(this._serverSettings);
    console.log("Available Kernels", kernelModels);

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
      const sessionId = this._notebookFileContent.metadata.session_id;
      if (sessionId) {
        const sessionModel = await this._sessionManager.findById(sessionId);

        if (sessionModel) {
          this._session = this._sessionManager.connectTo({
            model: sessionModel,
          });
        } else {
          this._session = await this.initializeNewSession();
        }
      } else {
        this._session = await this.initializeNewSession();
      }

      this.messageService.info(`Connected to ${this._session.kernel?.name}`);
    } catch (ex) {
      this.messageService.warn("Cannot initialize kernel");
      console.log("Cannot initialize kernel", ex);
    }
  }

  protected async initNotebookServices(): Promise<void> {
    await this.initializeServerSettings();
    this.initializeKernelManager();
    this.initializeSessionManager();

    await this.initializeKernelEventHandler();
    // this._kernel = await kernelManager.startNew({ name: this.uri.toString() });

    // console.log("Current Session Manager", this._sessionManager);
    // // Register a callback for when the kernel changes state.

    // console.log("Listing all session", this._serverSettings);
    // const sessionModels = await SessionAPI.listRunning();
    // console.log("All session", sessionModels);

    // console.log("Executing code");

    // const currentCode = "! pip install seaborn";

    // const future = this._kernel.requestExecute({
    //   code: currentCode,
    // });

    // // Handle iopub messages
    // future.onIOPub = (msg) => {
    //   if (msg.header.msg_type !== "status") {
    //     console.log(JSON.stringify(msg, null, 2));
    //   }
    // };
    // await future.done;
    // console.log("Execution is done");

    // console.log("Send an inspect message");
    // const request: KernelMessage.ICompleteRequestMsg["content"] = {
    //   code: "matplotlib",
    //   cursor_pos: 5,
    // };
    // const inspectReply = await this._kernel.requestComplete(request);
    // console.log("Looking at reply");
    // if (inspectReply.content.status === "ok") {
    //   console.log(
    //     "Inspect reply:",
    //     JSON.stringify(inspectReply.content, null, 2)
    //   );
    // }

    // const kernelManager = new KernelManager({
    //   serverSettings,
    // });

    // const sessionManager = new SessionManager({ kernelManager });

    // console.log("Start a new session");

    // const notebookPath = this.uri.path.toString();
    // const sessionOptions: Session.ISessionOptions = {
    //   kernel: {
    //     name: "python",
    //   },
    //   path: notebookPath,
    //   type: "notebook",
    //   name: "foo.ipynb",
    // };
    // const sessionConnectionOptions: Session.ISessionConnection.IOptions = {
    //   model: {
    //     id: notebookPath,
    //     kernel: {
    //       name: "python",
    //     },
    //     path: notebookPath,
    //     type: "notebook",
    //     name: "foo.ipynb",
    //   },
    //   kernelConnectionOptions: 'serverSettings'
    // }

    // const sessionConnection = await sessionManager.startNew(sessionOptions);
    // await sessionConnection.setPath(notebookPath);

    // if (sessionConnection.kernel) {
    //   console.log('Execute "a=1"');
    //   const future = sessionConnection.kernel.requestExecute({ code: "a = 1" });
    //   future.onReply = (reply) => {
    //     console.log(
    //       `Got execute reply with status ${JSON.stringify(reply, null, 4)}`
    //     );
    //   };
    //   await future.done;

    //   console.log("Shut down session");
    //   await sessionConnection.shutdown();

    //   console.log(
    //     "Get a list of session models and connect to one if any exist"
    //   );
    //   const sessionModels = await SessionAPI.listRunning();
    //   if (sessionModels.length > 0) {
    //     const session = sessionManager.connectTo({ model: sessionModels[0] });
    //     console.log(`Connected to ${session.kernel?.name}`);
    //   }
    // }

    // console.log("Finding all existing kernels");

    // const kernelModels = await KernelAPI.listRunning();
    // console.log("Available Kernels", kernelModels);
    // if (kernelModels.length > 0) {
    //   console.log(`Connecting to ${kernelModels[0].name}`);
    //   kernelManager.connectTo({ model: kernelModels[0] });
    // }

    // const kernel = await kernelManager.startNew({ name: "python" });

    // kernel.statusChanged.connect((_, status) => {
    //   console.log(`Kernal status: ${status}`);
    // });

    // console.log("Executing code");
    // const future = kernel.requestExecute({ code: "a = 1\nprint(a)" });
    // // Handle iopub messages
    // future.onIOPub = (msg) => {
    //   if (msg.header.msg_type !== "status") {
    //     console.log("message from server", msg);
    //   }
    // };
    // await future.done;
    // console.log("Execution is done");
  }

  protected async init() {
    await this.initNotebookServices();
    const content = await this.fileService.readFile(this.uri);

    try {
      const _notebookFileContent = JSON.parse(content.value.toString());
      _notebookFileContent.cells.map(
        (c: ICellModel) => (c.id = nextId("h1st"))
      );

      this._notebookFileContent = _notebookFileContent;
    } catch (ex) {
      this._notebookFileContent = defaultNotebookModel;
    }

    const { setCells } = notebookActions;
    this.store.dispatch(setCells({ cells: this._notebookFileContent.cells }));
    this.createOrRestoreJupyterSession();

    // mark this widget as initialized
    this._initialized = true;

    this.update();
  }

  protected async onAfterAttach(msg: Message): Promise<void> {
    if (this.isVisible && !this._initialized) {
      await this.init();
    }

    super.onAfterAttach(msg);
  }

  protected onActivateRequest(msg: Message) {
    console.log("activated", msg, this.uri);

    if (!this._initialized) {
      this.init();
    }

    super.onActivateRequest(msg);
    this.update();
  }

  protected render(): React.ReactNode {
    const NotebookContext = this._context;
    return (
      <NotebookContext.Provider value={this._defaultContextValue}>
        <Provider store={this.store}>
          <Notebook
            uri={this.uri}
            model={this._notebookFileContent}
            width={this._width}
            height={this._height}
          />
        </Provider>
      </NotebookContext.Provider>
    );
  }
}

const defaultNotebookModel = {
  cells: [
    {
      id: nextId("h1st"),
      cell_type: "code",
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [],
    },
  ],
  metadata: {
    language_info: {
      codemirror_mode: {
        name: "ipython",
        version: 3,
      },
      file_extension: ".py",
      mimetype: "text/x-python",
      name: "python",
      nbconvert_exporter: "python",
      pygments_lexer: "ipython3",
      version: "3.7.7-final",
    },
    orig_nbformat: 2,
    kernelspec: {
      name: "",
      display_name: "",
      language: "python",
    },
  },
  nbformat: 4,
  nbformat_minor: 2,
};
