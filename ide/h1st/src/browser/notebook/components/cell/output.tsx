// import {Markdown} from "@nteract/presentational-components/lib/components/outputs";
import * as React from "react";
// import Markdown from "@nteract/outputs/lib/components/media/markdown";
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
} from "./media";
import { MediaUnsupported } from "./media/wildcard";

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
            <div className={`output output-data stream ${output.name}`}>
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
