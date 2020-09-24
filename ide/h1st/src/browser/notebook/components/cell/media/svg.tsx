import * as React from "react";

export const MediaSVG = (props: any) => (
  <div className="cell-output-plot-background">
    <div
      className="output-svg"
      dangerouslySetInnerHTML={{ __html: props.data.join("") }}
    />
  </div>
);

MediaSVG.defaultProps = {
  mediaType: "image/svg+xml",
};
