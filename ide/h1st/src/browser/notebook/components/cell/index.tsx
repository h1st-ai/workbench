import * as React from "react";
import Icon from "../icon";
import { notebookActions } from "../../reducers/notebook";
import klass from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { ICellModel, IStore } from "../../types";
import CellInput from "./input";
import CellOuput from "./output";
// import {
//   Input,
//   Prompt,
//   Source,
//   Outputs,
//   Cell,
// } from "@nteract/presentational-components";

const CELL_CODE = "code";
const CELL_MD = "markdown";

interface INotebookProps {
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
  const { setSelectedCell } = notebookActions;
  const dispatch = useDispatch();

  const { selectedCell, activeCell } = useSelector(
    (store: IStore) => store.notebook
  );

  function renderCodeCellHeaderControl(): React.ReactNode {
    return (
      <div>
        <button className="btn-cell-play">
          <Icon icon="play" />
        </button>
        <button className="btn-cell-md">
          <Icon icon="markdown" />
        </button>
      </div>
    );
  }

  function renderMarkdownHeaderControl(): React.ReactNode {
    return (
      <button className="btn-cell-toggle">
        <Icon icon="code" />
      </button>
    );
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
        <button className="btn-cell-delete">
          <Icon icon="delete" />
        </button>
      </div>
    );
  }

  function renderPrompt() {
    switch (cellType) {
      case CELL_CODE:
        return (
          <div className="cell-prompt">
            <div className="execution-count">
              [{model.execution_count || 0}]
            </div>
          </div>
        );

      case CELL_MD:
        return (
          <div className="cell-prompt">
            <div className="execution-count"></div>
          </div>
        );

      default:
        break;
    }
  }

  function _setSelectedCell() {
    if (selectedCell !== model.id) {
      dispatch(setSelectedCell({ id: model.id }));
    }
  }

  return (
    <React.Fragment>
      <div
        className={klass("cell-wrapper", `${model.cell_type}-cell`, {
          active: activeCell === model.id,
          selected: selectedCell === model.id,
        })}
        onClick={_setSelectedCell}
      >
        <div className="cell-controls">
          <button className="cell-btn-up">
            <Icon icon="cell-up" />
          </button>
          <button className="cell-btn-down">
            <Icon icon="cell-down" />
          </button>
          <button className="cell-btn-plus">
            <Icon icon="plus" />
          </button>
        </div>
        <div className="cell-content">
          <div className="cell-focusbar" />
          {renderPrompt()}
          <div className="cell-form">
            <div className="cell-input">
              {renderInputHeader()}
              <CellInput
                model={model}
                width={props.width}
                height={props.height}
              />
            </div>
            <div className="cell-output">
              <CellOuput model={model} />
            </div>
          </div>
        </div>
      </div>
      <pre>{JSON.stringify(model, null, 2)}</pre>
    </React.Fragment>
  );
}
