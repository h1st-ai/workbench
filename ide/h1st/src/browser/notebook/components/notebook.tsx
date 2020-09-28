import * as React from "react";
import { useSelector } from "react-redux";

import NotebookSteps from "./step-panel";
import Toolbar from "./toolbar";
// import { selectNotebook } from "../reducers/notebook";
import { NotebookCell } from "./cell";
import { ICellModel, IStore } from "../types";

// const { useEffect } = React;

export default function(props: any) {
  console.log(props.model);
  // const uri: URI = props.uri;
  // const content = props.model;
  const { cells } = useSelector((store: IStore) => store.notebook);

  React.useEffect(() => {});

  const codeCells = cells.map((c: ICellModel) => (
    <NotebookCell
      key={c.id}
      model={c}
      width={props.width}
      height={props.height}
    />
  ));

  return (
    <React.Fragment>
      <NotebookSteps />
      <Toolbar />
      {codeCells}
      {/* <p>{uri.toString()}</p> */}
      {/* <pre>{JSON.stringify(content, null, 2)}</pre> */}
    </React.Fragment>
  );
}