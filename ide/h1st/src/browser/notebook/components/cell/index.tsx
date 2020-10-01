import * as React from "react";
import Icon from "../icon";
import { notebookActions } from "../../reducers/notebook";
import klass from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { CELL_TYPE, ICellModel, IStore } from "../../types";
import CellInput from "./input";
import CellOuput from "./output";

// import { kernelActions } from "../../reducers/kernel";
import NotebookContext from "../../context";
import { NotebookFactory } from "../../notebook-factory";

const CELL_CODE = "code";
const CELL_MD = "markdown";

interface INotebookProps {
  index: number;
  model: ICellModel;
  width?: number;
  height?: number;
}

export function NotebookCell(props: INotebookProps) {
  const { model, index } = props;

  if (!model) {
    return null;
  }

  const cellType = model.cell_type;
  const {
    setSelectedCell,
    setActiveCell,
    setCellType,
    deleteCell,
    moveCellUp,
    moveCellDown,
    insertCellAfter,
    focusOnCell,
  } = notebookActions;
  const { currentKernel } = useSelector((store: IStore) => store.kernel);
  const { selectedCell, activeCell, executionQueue } = useSelector(
    (store: IStore) => store.notebook
  );

  const context = React.useContext(NotebookContext);

  const dispatch = useDispatch();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const controlRef = React.useRef<HTMLDivElement>(null);
  const focusRef = React.useRef<HTMLDivElement>(null);
  const promptRef = React.useRef<HTMLDivElement>(null);
  // const monacoRef = React.useRef<monaco.editor.IStandaloneCodeEditor>();

  const { width, height } = context;

  React.useEffect(() => {
    if (
      width &&
      wrapperRef.current &&
      controlRef.current &&
      focusRef.current &&
      promptRef.current
    ) {
      wrapperRef.current.style.width = `${width -
        controlRef.current?.offsetWidth -
        focusRef.current?.offsetWidth -
        promptRef.current?.offsetWidth -
        24}px`;
    }
  }, [width]);

  function execute() {
    if (model.source.join("").trim() === "") {
      console.log("omit empty cell");
      return;
    }

    console.log("omit empty cell");
    // context.manager?.setSelectedCell(model.id);
    context.manager?.addCellToQueue(model.id);
    // context.manager?.selectNextCellOf(model.id);
    context.manager?.executeQueue();

    // ev.stopPropagation();
    // ev.preventDefault();
  }

  function toMarkdown() {
    dispatch(setCellType({ type: CELL_TYPE.MD, cellId: model.id }));
    setTimeout(() => dispatch(setActiveCell({ cellId: model.id })), 0);
    context.manager?.setDirty(true);
  }

  function toCode() {
    dispatch(setCellType({ type: CELL_TYPE.CODE, cellId: model.id }));
    setTimeout(() => dispatch(focusOnCell({ cellId: model.id })), 0);
    context.manager?.setDirty(true);
  }

  function renderCodeCellHeaderControl(): React.ReactNode {
    return (
      <div>
        <button
          className="btn-cell-play"
          disabled={!currentKernel}
          onClick={execute}
        >
          <Icon icon="play" />
        </button>
        <button className="btn-cell-md" onClick={toMarkdown}>
          <Icon icon="markdown" />
        </button>
      </div>
    );
  }

  function renderMarkdownHeaderControl(): React.ReactNode {
    return (
      <button className="btn-cell-toggle" onClick={toCode}>
        <Icon icon="code" />
      </button>
    );
  }

  function deleteCodeCell() {
    dispatch(deleteCell({ cellId: model.id }));
    context.manager?.setDirty(true);
  }

  function moveUp() {
    dispatch(moveCellUp({ cellId: model.id }));
    context.manager?.setDirty(true);
    context.manager?.scrollTo(`#cell-${model.id}`);
  }

  function moveDown() {
    dispatch(moveCellDown({ cellId: model.id }));
    context.manager?.setDirty(true);
    context.manager?.scrollTo(`#cell-${model.id}`);
  }

  function insertAfter(ev: any) {
    ev.stopPropagation();
    ev.preventDefault();

    const newCell = NotebookFactory.makeNewCell();
    dispatch(
      insertCellAfter({
        cellId: model.id,
        cell: newCell,
      })
    );

    dispatch(focusOnCell({ cellId: newCell.id }));
    context.manager?.setDirty(true);
    context.manager?.scrollTo(`#cell-${newCell.id}`);
  }

  function renderInputHeader() {
    let headerControl = null;
    switch (cellType) {
      case CELL_CODE:
        headerControl = renderCodeCellHeaderControl();
        break;

      case CELL_MD:
        headerControl = renderMarkdownHeaderControl();
        break;

      default:
        break;
    }

    // return renderMarkdownHeader();
    return (
      <div className="input-header input-markdown">
        {headerControl}
        <button className="btn-cell-delete" onClick={deleteCodeCell}>
          <Icon icon="delete" />
        </button>
      </div>
    );
  }

  function renderPromptContent() {
    if (model.id) {
      return executionQueue.indexOf(model.id) === -1
        ? model.execution_count || "-"
        : "*";
    }
  }

  function renderPrompt() {
    switch (cellType) {
      case CELL_CODE:
        return (
          <div className="cell-prompt" ref={promptRef}>
            <div className="execution-count">[{renderPromptContent()}]</div>
          </div>
        );

      case CELL_MD:
        return (
          <div className="cell-prompt" ref={promptRef}>
            <div className="execution-count"></div>
          </div>
        );

      default:
        break;
    }
  }

  function _setSelectedCell() {
    if (selectedCell !== model.id) {
      dispatch(setSelectedCell({ cellId: model.id }));
    }
  }

  function _handleDoubleClick() {
    if (cellType === CELL_MD) {
      dispatch(setActiveCell({ cellId: model.id }));
    }
  }

  function renderInput() {
    return (
      <div className="cell-input">
        {renderInputHeader()}
        <CellInput model={model} width={width} height={height} />
      </div>
    );
  }

  function renderOutput() {
    return (
      <div className="cell-output">
        <CellOuput key={model.id} model={model} />
      </div>
    );
  }

  return (
    <React.Fragment>
      <div
        id={`cell-${model.id}`}
        className={klass("cell-wrapper", `${model.cell_type}-cell`, {
          active: activeCell === model.id,
          selected: selectedCell === model.id,
        })}
        onClick={_setSelectedCell}
        onDoubleClick={_handleDoubleClick}
      >
        <div className="cell-controls" ref={controlRef}>
          <button
            className="cell-btn-up"
            onClick={moveUp}
            disabled={index === 0}
          >
            <Icon icon="cell-up" />
          </button>
          <button className="cell-btn-down" onClick={moveDown}>
            <Icon icon="cell-down" />
          </button>
          <button className="cell-btn-plus" onClick={insertAfter}>
            <Icon icon="plus" />
          </button>
        </div>
        <div className="cell-content">
          <div className="cell-focusbar" ref={focusRef} />
          {renderPrompt()}
          <div className="cell-form" ref={wrapperRef}>
            {renderInput()}
            {renderOutput()}
          </div>
        </div>
      </div>
      {/* {model.cell_type !== CELL_TYPE.MD && (
        <pre>{JSON.stringify(model, null, 2)}</pre>
      )} */}
    </React.Fragment>
  );
}
