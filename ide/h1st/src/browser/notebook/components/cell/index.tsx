import * as React from "react";
import Icon from "../icon";
import { notebookActions } from "../../reducers/notebook";
import klass from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { IStore } from "../../types";
import CellInput from "./input";
// import {
//   Input,
//   Prompt,
//   Source,
//   Outputs,
//   Cell,
// } from "@nteract/presentational-components";

const CELL_CODE = "code";
const CELL_MD = "markdown";

export function NotebookCell(props: any) {
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

  function _setSelectedCell() {
    if (selectedCell !== model.id) {
      dispatch(setSelectedCell({ id: model.id }));
    }
  }

  return (
    <React.Fragment>
      <div
        className={klass("cell-wrapper", {
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
          <div className="cell-prompt">
            <div className="execution-count">[*]</div>
          </div>
          <div className="cell-input">
            {renderInputHeader()}
            <CellInput model={model} />
            {/* <pre>{model.source.join("")}</pre> */}
          </div>
          <div className="cell-output"></div>
        </div>
      </div>
      <pre>{JSON.stringify(model, null, 2)}</pre>
    </React.Fragment>
  );
}
