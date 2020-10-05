import * as React from "react";
import ReactTooltip from "react-tooltip";

import { CELL_TYPE, ICellOutputProps, IStore } from "../../types";
import { useSelector } from "react-redux";
import { KernelOutputError, Media, RichMedia } from "@nteract/outputs";
import {
  MediaGIF,
  MediaHTML,
  MediaJavascript,
  MediaJPG,
  MediaPlotly,
  MediaPNG,
  MediaSVG,
  Plain,
  // KernelOutputError as KernelOutputErrors,
} from "./media";
import { MediaUnsupported } from "./media/wildcard";
import NotebookContext from "../../context";

const MarkDown = require("react-markdown");

export enum CELL_OUTPUT_TYPE {
  ERROR = "error",
  EXECUTION_RESULT = "execute_result",
  DISPLAY_DATA = "display_data",
  UPDATE_DISPLAY_DATA = "update_display_data",
  INSPECT_REPLY = "inspect_reply",
  STREAM = "stream",
}

export default React.memo(function CellOuput(props: ICellOutputProps) {
  const { model } = props;
  const { activeCell } = useSelector((store: IStore) => store.notebook);
  const context = React.useContext(NotebookContext);

  function renderMedia() {
    let output;

    switch (model.cell_type) {
      case CELL_TYPE.MD:
        //only show input if the cell is active
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

  function toggleOuput() {
    context.manager?.toggleCellOutputs([model.id], !model.metadata.collapsed);
  }

  function toggleMarkdownOuput(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    toggleOuput();
  }

  function renderCodeOutput(data: any[]) {
    if (!data) return null;

    if (model.metadata.collapsed) {
      return (
        <div className="output collapsed" onDoubleClick={toggleOuput}>
          <div
            data-tip="Output collapsed. Double click to expand"
            data-for={`toolbar-cell-output-${model.id}`}
          >
            ...
          </div>
          <ReactTooltip
            id={`toolbar-cell-output-${model.id}`}
            effect="solid"
            place="bottom"
            delayShow={400}
            multiline={true}
          />
        </div>
      );
    }

    const outputs = data.map((output) => {
      switch (output.output_type) {
        case CELL_OUTPUT_TYPE.ERROR:
          return (
            <div key={output.output_type} className="output output-error">
              <KernelOutputError output={output} />
              {/* <KernelOutputErrors data={output} /> */}
            </div>
          );

        case CELL_OUTPUT_TYPE.STREAM:
          return (
            <div
              key={output.output_type}
              className={`output output-data stream ${output.name}`}
            >
              <pre>
                {Array.isArray(output.text)
                  ? output.text.join("")
                  : output.text}
              </pre>
            </div>
          );

        default:
          return (
            <div
              key={output.output_type}
              className={`output output-data rich_media ${output.output_type}`}
            >
              <RichMedia data={output.data}>
                <MediaPlotly />
                <MediaJavascript />
                <MediaHTML />
                <MediaSVG />
                <MediaPNG />
                <MediaJPG />
                <MediaGIF />
                <Media.Json />
                <Media.LaTeX />
                <Media.Markdown />
                <Plain />
                <MediaUnsupported />
              </RichMedia>
            </div>
          );
        // return <p>{JSON.stringify(output, null, 2)}</p>;
      }
    });

    return outputs;
  }

  function renderMarkdown(data: string) {
    if (!data) {
      return;
    }

    if (model.metadata.collapsed) {
      return (
        <div className="output collapsed" onDoubleClick={toggleMarkdownOuput}>
          <div
            data-tip="Output collapsed. Double click to expand"
            data-for={`toolbar-cell-output-${model.id}`}
          >
            ...
          </div>
          <ReactTooltip
            id={`toolbar-cell-output-${model.id}`}
            effect="solid"
            place="bottom"
            delayShow={400}
            multiline={true}
          />
        </div>
      );
    }

    return <div className="markdown-body">{<MarkDown source={data} />}</div>;
  }

  if (
    model.cell_type === CELL_TYPE.MD ||
    (model.outputs && model.outputs.length > 0)
  ) {
    return <div className="cell-output-wrapper">{renderMedia()}</div>;
  }

  return null;
});
