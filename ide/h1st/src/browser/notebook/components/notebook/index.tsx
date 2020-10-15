import * as React from "react";
import { useSelector, useDispatch } from "react-redux";

// import NotebookSteps from "./step-panel";
import Toolbar from "../toolbar";
import { notebookActions } from "../../reducers/notebook";
import { NotebookCell } from "../cell";
import { ICellModel, IStore } from "../../types";
import Icon from "../icon";
import { NotebookFactory } from "../../notebook-factory";
import NotebookContext from "../../context";

export default function(props: any) {
  console.log(props.model);
  // const uri: URI = props.uri;
  // const content = props.model;
  const context = React.useContext(NotebookContext);
  const { cells, freeze } = useSelector((store: IStore) => store.notebook);

  React.useEffect(() => {
    context.manager?.setSelectedCell(cells[0].id);
  }, []);

  const codeCells = cells.map((c: ICellModel, index: number) => (
    <NotebookCell
      index={index}
      key={c.id}
      model={c}
      width={props.width}
      height={props.height}
    />
  ));

  return (
    <div className="notebook-wrapper">
      {freeze && <div className="action-overlay"></div>}
      <Toolbar />
      <ExtraBar position="top" />
      <div className="notebook-cells-container">{codeCells}</div>
      <ExtraBar position="bottom" />
    </div>
  );
}

interface IExtraBarProps {
  position: "top" | "bottom";
}

function ExtraBar({ position }: IExtraBarProps) {
  const dispatch = useDispatch();
  const { insertCellAt, focusOnCell } = notebookActions;
  const { cells } = useSelector((store: IStore) => store.notebook);

  function addCell() {
    const cell = NotebookFactory.makeNewCell();

    switch (position) {
      case "top":
        dispatch(insertCellAt({ cell, cellIndex: 0 }));
        break;

      default:
        dispatch(insertCellAt({ cell, cellIndex: cells.length }));
        break;
    }

    setTimeout(() => dispatch(focusOnCell({ cellId: cell.id })));
  }

  return (
    <div className="notebook-extra-bar">
      <button onClick={addCell}>
        <Icon icon="plus" width={16} height={16} />
      </button>
    </div>
  );
}
