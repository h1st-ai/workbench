import * as React from "react";

export const MediaPNG = (props: any) => {
  console.log("rendering png");

  return (
    <div className="cell-output-plot-background">
      <img alt="" src={`data:${props.mediatype};base64,${props.data}`} />
    </div>
  );
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
