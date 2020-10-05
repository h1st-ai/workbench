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
import { CELL_TYPE, INotebook, KERNEL_STATUS } from "./types";
import { H1stNotebookWidget } from "./h1st-notebook-widget";
import { ICellCodeInfo } from "../../common/types";
import { NotebookFactory } from "./notebook-factory";
import { ConfirmDialog } from "@theia/core/lib/browser";

export class NotebookManager {
  private _kernelManager: KernelManager;
  private _kernelSpecManager: KernelSpecManager;
  private _kernelSpecs: ISpecModels | null;
  private _session: Session.ISessionConnection;
  private _sessionManager: SessionManager;
  private _serverSettings: ServerConnection.ISettings;

  constructor(
    // the widget container
    readonly widget: H1stNotebookWidget,
    // the uri of the file
    readonly uri: URI,
    protected readonly model: NotebookModel,
    protected readonly store: any,
    protected readonly h1stBackendClient: H1stBackendWithClientService,
    protected readonly messageService: MessageService
  ) {}

  static getDomCellId(cellId: string): string {
    return `#cell-${cellId}`;
  }

  setDirty(dirty: boolean) {
    this.model.setDirty(dirty);
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

  test() {
    alert("test");
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
        // this.messageService.warn("Session connect status changed");
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

  /**
   * create a new session to Jupyter notebook server. It will attempt to
   * connect to the same session using the underlying uri
   */
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

  /**
   * Initialize a new session to Jupyter notebook server
   */
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

  /**
   * Interrupt the current kernel
   */
  async interrupKernel() {
    this._session.kernel?.interrupt();

    this.messageService.info(ApplicationLabels.KERNEL.MSG_INTERRUPT, {
      timeout: 3000,
    });
    const { clearQueue } = notebookActions;

    await this.store.dispatch(clearQueue());
  }

  async clearAllCellOutput() {
    const { clearCellOutputs } = notebookActions;

    await this.store.dispatch(clearCellOutputs());
  }

  /**
   * Restart the current kernel
   */
  restartKernel = async (confirm: boolean = true) => {
    console.log("restarting Kernel");

    let answer: string | undefined = "Yes";

    if (confirm) {
      answer = await this.messageService.info(
        ApplicationLabels.KERNEL.MSG_RESTART,
        "No",
        "Yes"
      );
    }

    if (answer === "Yes") {
      if (this._session.kernel) {
        try {
          this.messageService.info(ApplicationLabels.KERNEL.MSG_RESTARTING, {
            timeout: 4000,
          });
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

  restartKernelAndRunAll = async () => {
    const {
      TITLE_RESTART_AND_RUN_ALL,
      MSG_RESTART_AND_RUN_ALL,
      BTN_RESTART_AND_RUN_ALL,
      BTN_CONTINUE_RUNNING,
    } = ApplicationLabels.KERNEL;

    const dialog = new ConfirmDialog({
      title: TITLE_RESTART_AND_RUN_ALL,
      msg: MSG_RESTART_AND_RUN_ALL,
      ok: BTN_RESTART_AND_RUN_ALL,
      cancel: BTN_CONTINUE_RUNNING,
    });

    if (await dialog.open()) {
      this.toogleActionOverlay(true);
      await this.restartKernel(false);
      let tries = 0;

      const intervalId = setInterval(async () => {
        // give up after 10 second
        if (tries === 10) {
          this.messageService.error("Kernel failed to restart");
          clearInterval(intervalId);
          this.toogleActionOverlay(false);
        }

        console.log(
          "this._session.kernel?.status",
          this._session.kernel?.status
        );

        if (this._session.kernel?.status === KERNEL_STATUS.IDLE) {
          clearInterval(intervalId);
          this.toogleActionOverlay(false);
          await this.executeCells(0);
        }

        tries += 1;
      }, 2000);
    }
  };

  toogleActionOverlay = (show?: boolean) => {
    const { toogleActionOverlay } = notebookActions;

    this.store.dispatch(toogleActionOverlay({ show }));
  };

  getAppState = () => {
    return this.store.getState();
  };

  getSelectedCell = () => {
    return this.getAppState().notebook.selectedCell;
  };

  getSelectedCells = (): string[] => {
    return this.getAppState().notebook.selectedCells;
  };

  getActiveCell = () => {
    return this.getAppState().notebook.activeCell;
  };

  moveSelectedCellUp = () => {
    const cellId = this.getSelectedCell();

    if (cellId) {
      const { moveCellUp } = notebookActions;
      this.store.dispatch(moveCellUp({ cellId }));
      this.setDirty(true);
      this.scrollTo(NotebookManager.getDomCellId(cellId));
    }
  };

  moveSelectedCellDown = () => {
    const cellId = this.getSelectedCell();

    if (cellId) {
      const { moveCellDown } = notebookActions;
      this.store.dispatch(moveCellDown({ cellId }));
      this.setDirty(true);
      this.scrollTo(NotebookManager.getDomCellId(cellId));
    }
  };

  ensureCellInNotebook = () => {
    const { ensureCellInNotebook } = notebookActions;
    this.store.dispatch(ensureCellInNotebook());
  };

  cutCells = () => {
    const { cutCells } = notebookActions;
    this.store.dispatch(cutCells({}));
  };

  copyCells = () => {
    const { copyCells } = notebookActions;
    this.store.dispatch(copyCells({}));
  };

  pasteCells = (position: string = "bottom") => {
    const { pasteCells } = notebookActions;
    const selectedCell = this.getSelectedCell();
    // @ts-ignore
    this.store.dispatch(pasteCells({ position }));

    setTimeout(() => {
      this.scrollTo(NotebookManager.getDomCellId(selectedCell));
      this.setSelectedCell(selectedCell);
    }, 100);
  };

  executeSelectedCells = async () => {
    const selectedCells = this.getSelectedCells();

    await this.executeCells(selectedCells);
  };

  /**
   * Execute the current cell in the queue.
   *
   * @param input - the index or the cell id from which the execution starts
   * @returns none
   *
   */
  executeCells = async (input: string | number | string[]) => {
    const {
      addCellsAfterIndexToQueue,
      addCellsAfterCellToQueue,
      addCellsToQueue,
    } = notebookActions;

    if (typeof input === "number") {
      await this.store.dispatch(
        addCellsAfterIndexToQueue({ startIndex: input })
      );
    } else if (Array.isArray(input)) {
      await this.store.dispatch(addCellsToQueue({ cellIds: input }));
    } else {
      await this.store.dispatch(addCellsAfterCellToQueue({ cellId: input }));
    }

    await this.executeQueue();
  };

  /**
   * Execute the all current cells in the queue.
   *
   * @returns none
   *
   * TODO: Refactor this function not to mutate store directly
   *
   */
  executeQueue = async () => {
    const state = this.getAppState();
    const { removeCellFromQueue } = notebookActions;

    const exeQueue = state.notebook.executionQueue;
    console.log("queue length", exeQueue.length);

    if (exeQueue.length > 0) {
      const { connectionStatus, status: kernelStatus } = state.kernel;

      if (connectionStatus === "connected" && kernelStatus === "idle") {
        console.log("executing cell");
        let cellInfo = null;
        let cellId = exeQueue[0];
        cellInfo = this.getCodeCellInfoFromId(cellId, state.notebook);

        // only execute code cell
        if (cellInfo) {
          if (cellInfo.type === CELL_TYPE.CODE) {
            console.log("execute next cell");
            this.scrollTo(NotebookManager.getDomCellId(cellId));
            // await this.store.dispatch(setSelectedCell({ cellId }));
            await this.executeCodeCell(cellInfo.code, cellId);
          }
        }

        // remove cell from the queue and do nothing
        await this.store.dispatch(removeCellFromQueue());

        // process the next item in the queue
        await this.executeQueue();
      }
    }
  };

  setSelectedCell(cellId: string) {
    const { setSelectedCell } = notebookActions;
    this.store.dispatch(setSelectedCell({ cellId }));
  }

  // Enter keypress on notebook
  enterEditMode() {
    const cellId = this.getSelectedCell();
    console.log("entering edit mode");

    if (cellId && cellId !== this.getAppState().notebook.activeCell) {
      const { setCurrentCell, focusOnCell } = notebookActions;
      this.store.dispatch(setCurrentCell({ cellId }));
      this.store.dispatch(focusOnCell({ cellId }));
    }
  }

  insertCellAroundSelectedCell(position: string = "after") {
    const cellId = this.getSelectedCell();

    // do not run this command when there is a current focused cell
    if (cellId && !this.getAppState().notebook.activeCell) {
      console.log("inserting new cell before selected cell", cellId);

      const {
        insertCellBefore,
        insertCellAfter,
        setCurrentCell,
        focusOnCell,
      } = notebookActions;
      const cell = NotebookFactory.makeNewCell();

      if (position === "before") {
        this.store.dispatch(insertCellBefore({ cellId, cell }));
      } else {
        this.store.dispatch(insertCellAfter({ cellId, cell }));
      }

      // focusing on the new cell
      this.store.dispatch(setCurrentCell({ cellId: cell.id }));
      this.store.dispatch(focusOnCell({ cellId: cell.id }));
    }
  }

  undoDeleteCell() {
    const { undoDeleteCell } = notebookActions;

    this.store.dispatch(undoDeleteCell());
  }

  deleteCells(cellIds: string[]) {
    const { deleteCells } = notebookActions;

    this.store.dispatch(deleteCells({ cellIds }));
  }

  deleteSelectedCell() {
    const cellIds = this.getSelectedCells();

    if (cellIds) {
      this.deleteCells(cellIds);
    }
  }

  toggleCellOutputs(cellIds: string[], show: boolean) {
    const { toggleCellOutputs } = notebookActions;
    this.store.dispatch(toggleCellOutputs({ cellIds, show }));
  }

  toggleCellLineNumber() {
    const { toggleCellLineNumber } = notebookActions;
    this.store.dispatch(toggleCellLineNumber());
  }

  selectNextCell() {
    const cellId = this.getSelectedCell();

    if (cellId) {
      this.selectNextCellOf(cellId);

      setTimeout(() => this.scrollTo(NotebookManager.getDomCellId(cellId)), 0);
    }
  }

  selectNextCellOf(cellId: string) {
    const { selectNextCellOf } = notebookActions;
    this.store.dispatch(selectNextCellOf({ cellId }));
  }

  selectPrevCell() {
    const cellId = this.getSelectedCell();

    if (cellId) {
      this.selectPrevCellOf(cellId);

      setTimeout(() => this.scrollTo(NotebookManager.getDomCellId(cellId)), 0);
    }
  }

  selectPrevCellOf(cellId: string) {
    const { selectPrevCellOf } = notebookActions;
    this.store.dispatch(selectPrevCellOf({ cellId }));
  }

  focusPrevCellOf(cellId: string) {
    const { focusPrevCellOf } = notebookActions;

    this.store.dispatch(focusPrevCellOf({ cellId }));
  }

  focusNextCellOf(cellId: string) {
    const { focusNextCellOf } = notebookActions;
    this.store.dispatch(focusNextCellOf({ cellId }));
  }

  changeCellType(type: string, cellIds: string[]) {
    const { setCellsType } = notebookActions;

    if (type === CELL_TYPE.MD) {
      this.store.dispatch(setCellsType({ type: CELL_TYPE.MD, cellIds }));
    }
  }

  /**
   * add cell ids to the execution queue
   */
  addCellsToQueue(cellIds: string[]) {
    console.log("Adding cell to queue", cellIds);
    const { addCellsToQueue } = notebookActions;

    this.store.dispatch(addCellsToQueue({ cellIds }));
  }

  /**
   * add the current selected cell to queue (one mark with a blue border)
   */
  addSelectedCellToQueue() {
    const { selectedCells: cellIds } = this.getAppState().notebook;

    if (cellIds) {
      this.addCellsToQueue(cellIds);
    }
  }

  // /**
  //  * Execute code cell, this function can be comebine with other action like select next cell
  //  * to accomodate different behavior of the notebook
  //  */
  // protected executeCell = async (cellId: string) => {
  //   this.executeCodeCell
  // })

  /**
   * Do execute a code cell by sending its code to Jupyter kernel and receive the response
   * then update the output of the code cell inside the store
   *
   * @param code - the code to be executed
   * @param cellId - the code cell identifier to update the output
   *
   */
  protected executeCodeCell = async (code: string, cellId: string) => {
    if (code.trim() === "") {
      return;
    }

    if (this._session.kernel) {
      const state = this.getAppState();
      const { updateCellOutput, clearCellOutput } = notebookActions;
      const { setKernelStatus } = kernelActions;
      const { selectedCell } = state.notebook;

      console.log("Executing code", this._session.kernel.status);

      if (selectedCell !== cellId) {
        this.setSelectedCell(cellId);
      }

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
        // await this.store.dispatch(updateCellExecutionCount({ cellId }));
      };

      await future.done;
      this.setDirty(true);
    }
  };

  /**
   * get the source code of a cell identified by cellId
   */
  private getCodeCellInfoFromId(
    cellId: string,
    state: INotebook
  ): ICellCodeInfo | null {
    for (let i = 0; i < state.cells.length; i++) {
      if (cellId === state.cells[i].id) {
        return {
          code: state.cells[i].source.join(""),
          type: state.cells[i].cell_type,
        };
      }
    }

    return null;
  }

  async getAutoCompleteItems(
    code: string | undefined,
    cursor_pos: number
  ): Promise<string[]> {
    if (!code) {
      return [];
    }

    console.log("request complete items");
    const request: KernelMessage.ICompleteRequestMsg["content"] = {
      code,
      cursor_pos,
    };
    const inspectReply = await this._session.kernel?.requestComplete(request);

    if (inspectReply?.content.status === "ok") {
      return inspectReply?.content.matches;
    }

    return [];
  }

  async init() {
    await this.initializeServerSettings();
    this.initializeKernelManager();
    this.initializeSessionManager();

    await this.initializeKernelSpecsManager();
    await this.createOrRestoreJupyterSession();

    await this.initializeKernelEventHandler();
  }

  isVisibleWithinWidget(node: HTMLElement) {
    let notVisible = true;
    if (node) {
      // node is not visible when offsetTop + node.height > widget.height
      // or when node.offsetTop > widget.scrollTop + widget.height

      // but the thing can be partial visible, we want to add some padding
      const padding = 0;

      notVisible =
        node.offsetTop + node.clientHeight + padding <
          this.widget.node.scrollTop ||
        node.offsetTop >
          this.widget.node.scrollTop + this.widget.node.clientHeight + padding;
    }

    return !notVisible;
  }

  /**
   * Scroll to the item identify by the selector string .classname #id etc...
   */
  scrollTo(selector: string) {
    const node: HTMLElement | null = this.widget.node.querySelector(selector);

    if (node) {
      if (!this.isVisibleWithinWidget(node)) {
        node.scrollIntoView({ block: "center" });
      }
      //
    }
  }
}
