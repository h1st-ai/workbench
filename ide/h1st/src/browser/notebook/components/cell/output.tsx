// import {Markdown} from "@nteract/presentational-components/lib/components/outputs";
import * as React from "react";
import Markdown from "@nteract/outputs/lib/components/media/markdown";
import { CELL_TYPE, ICellOutputProps, IStore } from "../../types";
import { useSelector } from "react-redux";
import { KernelOutputError } from "@nteract/outputs";
// import MarkdownRender from '@nteract/markdown'

// import {
//   Input,
//   Prompt,
//   Source,
//   Outputs,
//   Cell,
// } from "@nteract/presentational-components";

export default function CellOuput(props: ICellOutputProps) {
  const { model } = props;
  const { activeCell } = useSelector((store: IStore) => store.notebook);

  function renderMedia() {
    let output;

    switch (model.cell_type) {
      case CELL_TYPE.MD:
        if (activeCell !== model.id) {
          output = renderMarkdown(model.source.join(""));
        } else {
          output = null;
        }
        break;

      case CELL_TYPE.CODE:
        output = renderCodeOutput(model.outputs);
        break;

      default:
        output = model.cell_type;
        break;
    }

    return output;
  }

  function renderCodeOutput(data: any[]) {
    const outputs = data.map((output) => {
      switch (output.output_type) {
        case "error":
          return <KernelOutputError output={output} />;

        default:
          return null;
      }
    });

    return outputs;
  }

  function renderMarkdown(data: string) {
    return <Markdown data={data} />;
    // return <p>{data}</p>;
    // return <MarkdownRender source={data} />
  }

  return <div className="cell-output-wrapper">{renderMedia()}</div>;
}