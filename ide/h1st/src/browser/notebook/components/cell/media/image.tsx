import * as React from "react";

const PNG = (props: any) => {
  console.log("rendering png");

  return (
    <div className="cell-output-plot-background">
      <img alt="" src={`data:${props.mediatype};base64,${props.data}`} />
    </div>
  );
};

PNG.defaultProps = {
  mediaType: "image/png",
};

export const MediaPNG = React.memo(PNG);

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
