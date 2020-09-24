import * as React from "react";

export const MediaPNG = (props: any) => {
  console.log("rendering png");
  const img = (
    <img alt="" src={`data:${props.mediatype};base64,${props.data}`} />
  );

  if (props.metadata) {
    if (props.metadata.needs_background) {
      return <div className="cell-output-plot-background">{img}</div>;
    }
  }

  return <div className="cell-output-plot-background">{img}</div>;
};

MediaPNG.defaultProps = {
  mediaType: "image/png",
};

export const MediaJPG = (props: any) => (
  <img alt="" src={`data:${props.mediatype};base64,${props.data}`} />
);
MediaJPG.defaultProps = {
  mediaType: "image/jpeg",
};

export const MediaGIF = (props: any) => (
  <img alt="" src={`data:${props.mediatype};base64,${props.data}`} />
);
MediaGIF.defaultProps = {
  mediaType: "image/gif",
};
