import * as React from "react";
import stickybits from "stickybits";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faPlus,
  faCut,
  faCopy,
  faClipboard,
  faArrowUp,
  faArrowDown,
  faStepForward,
  faStop,
  faRedo,
  faFastForward,
  faForward,
} from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";
import Icon from "../icon";
import { useSelector, useDispatch } from "react-redux";
import { IStore } from "../../types";
import NotebookContext from "../../context";
import { notebookActions } from "../../reducers/notebook";
import { NotebookFactory } from "../../notebook-factory";
import { ApplicationLabels } from "../../labels";

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
  const { status } = useSelector((store: IStore) => store.kernel);

  if (currentKernel) {
    return (
      <div data-for="toolbar-kernel" data-tip={`Kernel status: ${status}`}>
        {currentKernel.display_name}: <KernelStatus />
        <ReactTooltip
          id="toolbar-kernel"
          effect="solid"
          place="bottom"
          delayShow={400}
          multiline={true}
        />
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
          <button
            onClick={save}
            data-for="toolbar-tip"
            data-tip={ApplicationLabels.TOOLTIP.SAVE}
          >
            <FontAwesomeIcon icon={faSave} style={ICON_STYLE} />
          </button>
        </li>

        <li>
          <button
            onClick={createNewCell}
            data-for="toolbar-tip"
            data-tip={ApplicationLabels.TOOLTIP.ADD_CELL_BELOW}
          >
            <FontAwesomeIcon icon={faPlus} style={ICON_STYLE} />
          </button>
        </li>

        <li>
          <button
            onClick={cutCells}
            data-for="toolbar-tip"
            data-tip={ApplicationLabels.TOOLTIP.CUT_CELLS}
          >
            <FontAwesomeIcon icon={faCut} style={ICON_STYLE} />
          </button>
          <button
            onClick={copyCells}
            data-for="toolbar-tip"
            data-tip={ApplicationLabels.TOOLTIP.COPY_CELLS}
          >
            <FontAwesomeIcon icon={faCopy} style={ICON_STYLE} />
          </button>
          <button
            onClick={pasteCells}
            data-for="toolbar-tip"
            data-tip={ApplicationLabels.TOOLTIP.PASTE_CELLS}
          >
            <FontAwesomeIcon icon={faClipboard} style={ICON_STYLE} />
          </button>
        </li>

        <li>
          <button
            onClick={moveUp}
            data-for="toolbar-tip"
            data-tip={ApplicationLabels.TOOLTIP.MOVE_UP}
          >
            <FontAwesomeIcon icon={faArrowUp} style={ICON_STYLE} />
          </button>
          <button
            onClick={moveDown}
            data-for="toolbar-tip"
            data-tip={ApplicationLabels.TOOLTIP.MOVE_DOWN}
          >
            <FontAwesomeIcon icon={faArrowDown} style={ICON_STYLE} />
          </button>
        </li>

        <li>
          <button
            onClick={executeSelectedCells}
            data-for="toolbar-tip"
            data-tip={ApplicationLabels.TOOLTIP.RUN_SELECTED}
          >
            <FontAwesomeIcon icon={faStepForward} style={ICON_STYLE} />{" "}
            <span>Run</span>
          </button>
          <button
            disabled={!selectedCell}
            onClick={executeAfter}
            data-for="toolbar-tip"
            data-tip={ApplicationLabels.TOOLTIP.RUN_ALL_CELL_AFTER}
          >
            <Icon width={16} height={16} icon="play-down" />
          </button>
          <button
            onClick={executeAll}
            data-for="toolbar-tip"
            data-tip={ApplicationLabels.TOOLTIP.RUN_ALL_CELL}
          >
            <FontAwesomeIcon icon={faForward} style={ICON_STYLE} />
          </button>
        </li>
        <li>
          <button
            onClick={interruptKernel}
            data-for="toolbar-tip"
            data-tip={ApplicationLabels.TOOLTIP.INTERRUP_KERNEL}
          >
            <FontAwesomeIcon icon={faStop} style={ICON_STYLE} />
          </button>
          <button
            onClick={doRestartKernel}
            data-for="toolbar-tip"
            data-tip={ApplicationLabels.TOOLTIP.RESTART_KERNEL}
          >
            <FontAwesomeIcon icon={faRedo} style={ICON_STYLE} />
          </button>
          <button
            onClick={restartKernelAndRunAll}
            data-for="toolbar-tip"
            data-tip={ApplicationLabels.TOOLTIP.RESTART_KERNAL_AND_RUN_ALL}
          >
            <FontAwesomeIcon icon={faFastForward} style={ICON_STYLE} />
          </button>
        </li>

        <li>
          <button
            onClick={clearAllCellOutputs}
            data-for="toolbar-tip"
            data-tip={ApplicationLabels.TOOLTIP.CELL_CLEAR_OUTPUTS}
          >
            <Icon width={24} height={24} icon="cell-clear" />
          </button>
        </li>
      </ul>

      <div className="kernel-info-wrapper">
        <JupyterServer />
        <JupyterKernel />
      </div>

      <ReactTooltip
        id="toolbar-tip"
        effect="solid"
        place="bottom"
        delayShow={400}
        multiline={true}
      />
    </div>
  );
}
