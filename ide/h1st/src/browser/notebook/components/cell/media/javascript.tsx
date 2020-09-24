import * as React from "react";

export const MediaJavascript = (props: any) => (
  <script
    type="text/javascript"
    dangerouslySetInnerHTML={{ __html: props.data.join("") }}
  />
);
MediaJavascript.defaultProps = {
  mediaType: "text/javascript",
};
