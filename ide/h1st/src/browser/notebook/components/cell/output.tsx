// import {Markdown} from "@nteract/presentational-components/lib/components/outputs";
import * as React from "react";
import Markdown from "@nteract/outputs/lib/components/media/markdown";
import { CELL_TYPE, ICellOutputProps, IStore } from "../../types";
import { useSelector } from "react-redux";
import { ExecuteResult, KernelOutputError, StreamText } from "@nteract/outputs";

enum CELL_OUTPUT_TYPE {
  ERROR = "error",
  EXECUTION_RESULT = "execute_result",
  DISPLAY_DATA = "display_data",
  UPDATE_DISPLAY_DATA = "update_display_data",
  INSPECT_REPLY = "inspect_reply",
  STREAM = "stream",
}

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
    if (!data) return null;

    const outputs = data.map((output) => {
      switch (output.output_type) {
        case CELL_OUTPUT_TYPE.ERROR:
          return (
            <div className="output output-error">
              <KernelOutputError output={output} />
            </div>
          );

        case CELL_OUTPUT_TYPE.STREAM:
          return (
            <div className="output output-data stream">
              <StreamText output={output} />
            </div>
          );

        case CELL_OUTPUT_TYPE.EXECUTION_RESULT:
          return (
            <div className="output output-data execution_result">
              <ExecuteResult output={output} />
            </div>
          );

        default:
          return (
            <div className={`output output-data ${output.output_type}`}>
              <KernelOutputError output={output} />
            </div>
          );
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
