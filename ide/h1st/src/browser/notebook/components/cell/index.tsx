import * as React from "react";
import Icon from "../icon";
// import {
//   Input,
//   Prompt,
//   Source,
//   Outputs,
//   Cell,
// } from "@nteract/presentational-components";

export function NotebookCell(props: any) {
  const { model } = props;

  return (
    <div className="cell-wrapper">
      <div className="cell-controls">
        <Icon icon="plus" />
      </div>
      <div className="cell-content">
        <div className="cell-input">
          <pre>{model.source.join("")}</pre>
        </div>
        <div className="cell-output"></div>
      </div>
    </div>
  );
}
