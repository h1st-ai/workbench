import * as React from "react";

import { notebookActions } from "../../reducers/notebook";
import klass from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { CELL_TYPE, ICellModel, IStore } from "../../types";
import CellInput from "./input";
import CellOuput from "./output";

// import { kernelActions } from "../../reducers/kernel";
import NotebookContext from "../../context";
// import { NotebookFactory } from "../../notebook-factory";

const CELL_CODE = "code";
const CELL_MD = "markdown";

interface INotebookProps {
  index: number;
  model: ICellModel;
  width?: number;
  height?: number;
}

export function NotebookCell(props: INotebookProps) {
  const { model } = props;

  if (!model) {
    return null;
  }

  const cellType = model.cell_type;
  const { setSelectedCell, setSelectedCells, setActiveCell } = notebookActions;
  const {
    selectedCell,
    selectedCells,
    activeCell,
    executionQueue,
  } = useSelector((store: IStore) => store.notebook);

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

  function toggleOuput() {
    if (model.cell_type === CELL_TYPE.CODE) {
      context.manager?.toggleCellOutputs([model.id], !model.metadata.collapsed);
    }
  }

  // function renderCodeCellHeaderControl(): React.ReactNode {
  //   return (
  //     <div className="input-buttons">
  //       <button
  //         data-tip="Run this cell"
  //         data-for={`toolbar-cell-header-${model.id}`}
  //         className="btn-cell-play"
  //         // disabled={!currentKernel}
  //         onClick={execute}
  //       >
  //         <FontAwesomeIcon size="sm" icon={faPlay} style={SVG_STYLE} />
  //       </button>
  //       <button
  //         data-tip="Change this cell to markdown"
  //         data-for={`toolbar-cell-header-${model.id}`}
  //         className="btn-cell-md"
  //         onClick={toMarkdown}
  //       >
  //         <Icon icon="markdown" />
  //       </button>
  //       <button
  //         data-tip="Toggle output for this cell"
  //         data-for={`toolbar-cell-header-${model.id}`}
  //         onClick={toggleOuput}
  //       >
  //         {!model.metadata.collapsed && (
  //           <FontAwesomeIcon size="sm" icon={faCompressAlt} style={SVG_STYLE} />
  //         )}
  //         {model.metadata.collapsed && (
  //           <FontAwesomeIcon size="sm" icon={faExpandAlt} style={SVG_STYLE} />
  //         )}
  //       </button>
  //       <ReactTooltip
  //         id={`toolbar-cell-header-${model.id}`}
  //         effect="solid"
  //         place="bottom"
  //         delayShow={400}
  //         multiline={true}
  //       />
  //     </div>
  //   );
  // }

  // function renderMarkdownHeaderControl(): React.ReactNode {
  //   return (
  //     <div className="input-buttons">
  //       <button
  //         className="btn-cell-play"
  //         data-tip="Toggle output for this cell"
  //         data-for={`toolbar-cell-header-${model.id}`}
  //         onClick={execute}
  //       >
  //         <FontAwesomeIcon size="sm" icon={faPlay} style={SVG_STYLE} />
  //       </button>
  //       <button
  //         className="btn-cell-toggle"
  //         data-tip="Change this cell to code"
  //         data-for={`toolbar-cell-header-${model.id}`}
  //         onClick={toCode}
  //       >
  //         <FontAwesomeIcon size="sm" icon={faCode} style={SVG_STYLE} />
  //       </button>
  //       <button
  //         data-tip="Toggle output for this cell"
  //         data-for={`toolbar-cell-header-${model.id}`}
  //         onClick={toggleOuput}
  //       >
  //         {!model.metadata.collapsed && (
  //           <FontAwesomeIcon size="sm" icon={faCompressAlt} style={SVG_STYLE} />
  //         )}
  //         {model.metadata.collapsed && (
  //           <FontAwesomeIcon size="sm" icon={faExpandAlt} style={SVG_STYLE} />
  //         )}
  //       </button>
  //       <ReactTooltip
  //         id={`toolbar-cell-header-${model.id}`}
  //         effect="solid"
  //         place="bottom"
  //         delayShow={400}
  //         multiline={true}
  //       />
  //     </div>
  //   );
  // }

  // function deleteCodeCell() {
  //   context.manager?.deleteCells([model.id]);
  //   context.manager?.setDirty(true);
  // }

  // function moveUp() {
  //   dispatch(moveCellUp({ cellId: model.id }));
  //   context.manager?.setDirty(true);
  //   context.manager?.scrollTo(`#cell-${model.id}`);
  // }

  // function moveDown() {
  //   dispatch(moveCellDown({ cellId: model.id }));
  //   context.manager?.setDirty(true);
  //   context.manager?.scrollTo(`#cell-${model.id}`);
  // }

  // function insertAfter(ev: any) {
  //   ev.stopPropagation();
  //   ev.preventDefault();

  //   const newCell = NotebookFactory.makeNewCell();
  //   dispatch(
  //     insertCellAfter({
  //       cellId: model.id,
  //       cell: newCell,
  //     })
  //   );

  //   dispatch(focusOnCell({ cellId: newCell.id }));
  //   context.manager?.setDirty(true);
  //   context.manager?.scrollTo(`#cell-${newCell.id}`);
  // }

  // function renderInputHeader() {
  //   let headerControl = null;
  //   switch (cellType) {
  //     case CELL_CODE:
  //       headerControl = renderCodeCellHeaderControl();
  //       break;

  //     case CELL_MD:
  //       headerControl = renderMarkdownHeaderControl();
  //       break;

  //     default:
  //       break;
  //   }

  //   // return renderMarkdownHeader();
  //   return (
  //     <div className="input-header input-markdown">
  //       {headerControl}
  //       <button
  //         data-for={`toolbar-cell-header-delete-${model.id}`}
  //         data-tip="Delete this cell"
  //         className="btn-cell-delete"
  //         onClick={deleteCodeCell}
  //       >
  //         <FontAwesomeIcon size="sm" icon={faTrashAlt} style={SVG_STYLE} />
  //       </button>
  //       <ReactTooltip
  //         id={`toolbar-cell-header-delete-${model.id}`}
  //         effect="solid"
  //         place="bottom"
  //         delayShow={400}
  //         multiline={true}
  //       />
  //     </div>
  //   );
  // }

  function renderPromptContent() {
    if (model.id) {
      return executionQueue.indexOf(model.id) === -1
        ? model.execution_count || " "
        : "*";
    }
  }

  function renderPrompt() {
    switch (cellType) {
      case CELL_CODE:
        return (
          <div
            className="cell-prompt"
            ref={promptRef}
            onDoubleClick={toggleOuput}
          >
            <div className="execution-count">
              In [{renderPromptContent()}]:{" "}
            </div>
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

  function _setSelectedCell(event: React.MouseEvent) {
    if (selectedCell !== model.id) {
      if (event.shiftKey) {
        dispatch(setSelectedCells({ cellId: model.id }));
      } else {
        dispatch(setSelectedCell({ cellId: model.id }));
      }
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
        {/* {renderInputHeader()} */}
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
          "multi-selected":
            selectedCells.includes(model.id) && selectedCells.length > 1,
        })}
        onClick={_setSelectedCell}
        onDoubleClick={_handleDoubleClick}
      >
        {/* <div className="cell-controls" ref={controlRef}>
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
        </div> */}
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
