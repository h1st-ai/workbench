// import {Markdown} from "@nteract/presentational-components/lib/components/outputs";
import * as React from "react";
import Markdown from "@nteract/outputs/lib/components/media/markdown";
import { CELL_TYPE, ICellOutputProps, IStore } from "../../types";
import { useSelector } from "react-redux";
// import * as Plotly from "plotly.js-dist";
import {
  // ExecuteResult,
  KernelOutputError,
  // StreamText,
  Media,
  RichMedia,
} from "@nteract/outputs";
// import ErrorBoundary from "./error";
// import { SVG } from "@nteract/outputs/lib/components/media";
// import { JavaScript } from "@nteract/outputs/lib/components/media";

const Plotly = require("plotly.js-dist");

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
    // console.log(StreamText);

    const outputs = data.map((output) => {
      // need to transform the output to be compatible with the display component
      // const tData = { ...output.data };

      // if (tData) {
      //   Object.keys(tData).forEach((mediaType) => {
      //     if (Array.isArray(tData[mediaType])) {
      //       tData[mediaType] = tData[mediaType].join("");
      //     }
      //   });
      // }

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
              {/* <StreamText
                  output={{ ...output, text: output.text.join("") }}
                /> */}
            </div>
          );

        // case CELL_OUTPUT_TYPE.EXECUTION_RESULT:
        //   return (
        //     <div className="output output-data execution_result">
        //       <ExecuteResult output={output} />
        //     </div>
        //   );

        default:
          return (
            <div className="output output-data rich_media">
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
              </RichMedia>
              {/* <DisplayData>
                <Plain />
                <MediaPNG />
              </DisplayData> */}
            </div>
          );
        // return <p>{JSON.stringify(output, null, 2)}</p>;
      }
    });

    return outputs;
  }

  function renderMarkdown(data: string) {
    return <Markdown data={data} />;
  }

  return <div className="cell-output-wrapper">{renderMedia()}</div>;
}

const Plain = (props: any) => <pre>{props.data.join("")}</pre>;
Plain.defaultProps = {
  mediaType: "text/plain",
};

const MediaPNG = (props: any) => {
  const img = (
    <img alt="" src={`data:${props.mediatype};base64,${props.data}`} />
  );
  if (props.metadata) {
    if (props.metadata.needs_background) {
      return <div className="cell-output-plot-background">{img}</div>;
    }
  }

  return img;
};
MediaPNG.defaultProps = {
  mediaType: "image/png",
};

const MediaJPG = (props: any) => (
  <img alt="" src={`data:${props.mediatype};base64,${props.data}`} />
);
MediaJPG.defaultProps = {
  mediaType: "image/jpeg",
};

const MediaGIF = (props: any) => (
  <img alt="" src={`data:${props.mediatype};base64,${props.data}`} />
);
MediaGIF.defaultProps = {
  mediaType: "image/gif",
};

const MediaSVG = (props: any) => (
  <div
    className="output-svg"
    dangerouslySetInnerHTML={{ __html: props.data.join("") }}
  />
);
MediaSVG.defaultProps = {
  mediaType: "image/svg+xml",
};

const MediaHTML = (props: any) => {
  const divRef = React.useRef<any>();

  React.useEffect(() => {
    if (divRef && divRef.current) {
      divRef.current.innerHTML = props.data.join("");
    }
  }, []);

  return (
    <div
      ref={divRef}
      className="output-html"
      // dangerouslySetInnerHTML={{ __html: props.data.join("") }}
    />
  );
};

MediaHTML.defaultProps = {
  mediaType: "text/html",
};

const MediaJavascript = (props: any) => (
  <script
    type="text/javascript"
    dangerouslySetInnerHTML={{ __html: props.data.join("") }}
  />
);
MediaJavascript.defaultProps = {
  mediaType: "text/javascript",
};

function MediaPlotly(props: any) {
  const divRef = React.useRef<any>();

  React.useEffect(() => {
    if (divRef && divRef.current) {
      console.log("rendering plotly");
      const data = JSON.parse(JSON.stringify(props.data));
      Plotly.plot(divRef.current, data);
    }
  });

  return (
    <div
      ref={divRef}
      className="output-plotly"
      // dangerouslySetInnerHTML={{ __html: "plotly goes here" }}
    />
  );
}

MediaPlotly.defaultProps = {
  mediaType: "application/vnd.plotly.v1+json",
};
