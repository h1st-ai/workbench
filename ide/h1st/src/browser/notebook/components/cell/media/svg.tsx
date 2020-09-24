import * as React from "react";

export const MediaSVG = (props: any) => (
  <div
    className="output-svg"
    dangerouslySetInnerHTML={{ __html: props.data.join("") }}
  />
);

MediaSVG.defaultProps = {
  mediaType: "image/svg+xml",
};
