import * as React from "react";
import stickybits from "stickybits";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faPlus,
  faCut,
  faCopy,
  faPaste,
  faArrowUp,
  faArrowDown,
  faStepForward,
  faStop,
  faRedo,
  faFastForward,
} from "@fortawesome/free-solid-svg-icons";
import Icon from "../icon";
import { useSelector, useDispatch } from "react-redux";
import { IStore } from "../../types";
import NotebookContext from "../../context";
import { notebookActions } from "../../reducers/notebook";
import { NotebookFactory } from "../../notebook-factory";

function KernelStatus() {
  const { status } = useSelector((store: IStore) => store.kernel);

  return <span className={`kernel-status ${status}`}>{status}</span>;
}

function ConnectIcon() {
  const { connectionStatus } = useSelector((store: IStore) => store.kernel);
  let icon;

  switch (connectionStatus) {
    case "connecting":
      icon = <Icon icon="connecting" width={24} height={24} />;
      break;

    default:
      icon = <Icon icon={connectionStatus} width={16} height={16} />;
      break;
  }

  return <span className={`connection-icon ${connectionStatus}`}>{icon}</span>;
}

function JupyterServer() {
  return (
    <div>
      <ConnectIcon />
      <span>Jupyter server: local</span>
    </div>
  );
}

function JupyterKernel() {
  const { currentKernel } = useSelector((store: IStore) => store.kernel);

  if (currentKernel) {
    return (
      <div>
        {currentKernel.display_name}: <KernelStatus />
      </div>
    );
  }
  return null;
}

export default function Toolbar() {
  const context = React.useContext(NotebookContext);
  const { selectedCell } = useSelector((store: IStore) => store.notebook);
  const dispatch = useDispatch();

  const { insertCellAfter, focusOnCell } = notebookActions;
  const ICON_STYLE = { color: "var(--theia-foreground)" };

  React.useEffect(() => {
    // sticky position for toolbar
    stickybits(".toolbar");
  }, []);

  const doRestartKernel = async (ev: any) => {
    await context.manager?.restartKernel(false);
  };

  const executeAll = async () => {
    await context.manager?.executeCells(0);
    context.manager?.setDirty(true);
  };

  const executeAfter = async () => {
    //@ts-ignore
    await context.manager?.executeCells(selectedCell);
    context.manager?.setDirty(true);
  };

  const interruptKernel = async () => {
    await context.manager?.interrupKernel();
  };

  const clearAllCellOutputs = async () => {
    await context.manager?.clearAllCellOutput();
    context.manager?.setDirty(true);
  };

  const createNewCell = () => {
    const newCell = NotebookFactory.makeNewCell();
    dispatch(
      insertCellAfter({
        cellId: selectedCell,
        cell: newCell,
      })
    );

    dispatch(focusOnCell({ cellId: newCell.id }));
    context.manager?.setDirty(true);
  };

  const save = () => {
    context.manager?.widget.save();
  };

  const moveUp = () => {
    context.manager?.moveSelectedCellUp();
  };

  const moveDown = () => {
    context.manager?.moveSelectedCellDown();
  };

  const cutCells = () => {
    context.manager?.cutCells();
  };

  const copyCells = () => {
    context.manager?.copyCells();
  };

  const pasteCells = () => {
    context.manager?.pasteCells();
  };

  const restartKernelAndRunAll = async () => {
    await context.manager?.restartKernelAndRunAll();
    context.manager?.setDirty(true);
  };

  const executeSelectedCells = async () => {
    await context.manager?.executeSelectedCells();
    await context.manager?.selectNextCell();
  };

  return (
    <div className="toolbar">
      <ul>
        <li>
          <button onClick={save}>
            <FontAwesomeIcon icon={faSave} style={ICON_STYLE} />
          </button>
        </li>

        <li>
          <button onClick={createNewCell}>
            <FontAwesomeIcon icon={faPlus} style={ICON_STYLE} />
          </button>
        </li>

        <li>
          <button onClick={cutCells}>
            <FontAwesomeIcon icon={faCut} style={ICON_STYLE} />
          </button>
          <button onClick={copyCells}>
            <FontAwesomeIcon icon={faCopy} style={ICON_STYLE} />
          </button>
          <button onClick={pasteCells}>
            <FontAwesomeIcon icon={faPaste} style={ICON_STYLE} />
          </button>
        </li>

        <li>
          <button onClick={moveUp}>
            <FontAwesomeIcon icon={faArrowUp} style={ICON_STYLE} />
          </button>
          <button onClick={moveDown}>
            <FontAwesomeIcon icon={faArrowDown} style={ICON_STYLE} />
          </button>
        </li>

        <li>
          <button onClick={executeSelectedCells}>
            <FontAwesomeIcon icon={faStepForward} style={ICON_STYLE} />{" "}
            <span>Run</span>
          </button>
          <button onClick={interruptKernel}>
            <FontAwesomeIcon icon={faStop} style={ICON_STYLE} />
          </button>
          <button onClick={doRestartKernel}>
            <FontAwesomeIcon icon={faRedo} style={ICON_STYLE} />
          </button>
          <button onClick={restartKernelAndRunAll}>
            <FontAwesomeIcon icon={faFastForward} style={ICON_STYLE} />
          </button>
        </li>
      </ul>

      <ul>
        <li>
          <button onClick={executeAll}>
            <Icon width={16} height={16} icon="fast-forward" />
          </button>
        </li>
        <li>
          <button disabled={!selectedCell} onClick={executeAfter}>
            <Icon width={16} height={16} icon="play-down" />
          </button>
        </li>

        <li>
          <button onClick={doRestartKernel}>
            <Icon width={16} height={16} icon="reload" />
          </button>
        </li>

        <li>
          <button className="btn-toolbar-stop" onClick={interruptKernel}>
            <Icon width={16} height={16} icon="stop" />
          </button>
        </li>

        <li>
          <button onClick={createNewCell}>
            <Icon width={24} height={24} icon="plus" />
          </button>
        </li>

        <li>
          <button onClick={clearAllCellOutputs}>
            <Icon width={24} height={24} icon="cell-clear" />
          </button>
        </li>
      </ul>

      <div className="kernel-info-wrapper">
        <JupyterServer />
        <JupyterKernel />
      </div>
    </div>
  );
}
