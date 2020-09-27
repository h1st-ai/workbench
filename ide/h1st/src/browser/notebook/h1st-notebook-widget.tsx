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
  KernelMessage,
  // SessionManager,
  // Session,
  // SessionAPI,
  ServerConnection,
} from "@jupyterlab/services";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Notebook from "./components/notebook";
// import Icon from "./components/icon";
import reducer from "./reducers";
import { notebookActions } from "./reducers/notebook";
import { ICellModel } from "./types";
import { ThemeService } from "@theia/core/lib/browser/theming";

@injectable()
export class H1stNotebookWidget extends ReactWidget
  implements NavigatableWidget {
  static readonly ID = "h1st:notebook:widget";
  private readonly store: any;
  private _content: any;
  private _width: number;
  private _height: number;

  constructor(
    readonly uri: URI,
    protected readonly selectionService: SelectionService,
    protected readonly fileService: FileService,
    protected readonly themeService: ThemeService,
    protected readonly messageService: MessageService
  ) {
    super();
    this.store = configureStore({ reducer, devTools: true });
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
    // if (msg.width < 0 || msg.height < 0) {
    //     this.editor.resizeToFit();
    // } else {
    //     this.editor.setSize(msg);
    // }
    const { width, height } = msg;
    this._width = width;
    this._height = height;
    this.update();
  }

  protected async initializeKernel(): Promise<void> {
    let FETCH: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
    let HEADERS: typeof Headers;
    let REQUEST: typeof Request;
    let WEBSOCKET: typeof WebSocket;

    FETCH = fetch;
    REQUEST = Request;
    HEADERS = Headers;
    WEBSOCKET = WebSocket;

    console.log(KernelAPI);

    this.messageService.info("Initialize Kernel. Retrieving kernels");

    const serverSettings: ServerConnection.ISettings = {
      baseUrl: "http://localhost:8888",
      appUrl: "http://localhost:8888",
      wsUrl: "ws://localhost:8888",
      token: "abc",
      init: { cache: "no-store", credentials: "same-origin" },
      fetch: FETCH,
      Headers: HEADERS,
      Request: REQUEST,
      WebSocket: WEBSOCKET,
    };

    const kernelManager = new KernelManager({ serverSettings });
    const kernel = await kernelManager.startNew({ name: "python" });

    // Register a callback for when the kernel changes state.
    kernel.statusChanged.connect((_, status) => {
      this.messageService.warn(`Kernel Status Changed: ${status}`);
    });

    console.log("Executing code");
    const future = kernel.requestExecute({
      code: "helloworld = 1\nprint(helloworld)",
    });

    // Handle iopub messages
    future.onIOPub = (msg) => {
      if (msg.header.msg_type !== "status") {
        console.log(JSON.stringify(msg, null, 2));
      }
    };
    await future.done;
    console.log("Execution is done");

    console.log("Send an inspect message");
    const request: KernelMessage.ICompleteRequestMsg["content"] = {
      code: "helloworld",
      cursor_pos: 5,
    };
    const inspectReply = await kernel.requestComplete(request);
    console.log("Looking at reply");
    if (inspectReply.content.status === "ok") {
      console.log(
        "Inspect reply:",
        JSON.stringify(inspectReply.content, null, 2)
      );
    }

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

  protected async onAfterAttach(msg: Message): Promise<void> {
    await this.initializeKernel();
    const content = await this.fileService.readFile(this.uri);

    try {
      const _content = JSON.parse(content.value.toString());
      _content.cells.map((c: ICellModel) => (c.id = nextId("h1st")));

      this._content = _content;
    } catch (ex) {
      this._content = defaultNotebookModel;
    }

    const { setCells, setActiveTheme } = notebookActions;
    this.store.dispatch(setCells({ cells: this._content.cells }));

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

    this.update();
    super.onAfterAttach(msg);
  }

  protected onActivateRequest(msg: Message) {
    console.log("activated", msg, this.uri);
    super.onActivateRequest(msg);
    this.update();
  }

  // protected renderToolbar(): React.ReactNode {
  //   return (
  //     <div className="notebook-toolbar">
  //       <ul>
  //         <li>
  //           <Icon icon="fast-forward" width={16} height={16} />
  //         </li>
  //       </ul>
  //     </div>
  //   );
  // }

  protected render(): React.ReactNode {
    return (
      <React.Fragment>
        <Provider store={this.store}>
          <Notebook
            uri={this.uri}
            model={this._content}
            width={this._width}
            height={this._height}
          />
        </Provider>
      </React.Fragment>
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
    },
  },
  nbformat: 4,
  nbformat_minor: 2,
};
