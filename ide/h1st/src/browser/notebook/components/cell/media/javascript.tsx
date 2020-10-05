import * as React from "react";

export const MediaJavascript = (props: any) => {
  React.useEffect(() => {
    const vScript = new Function(props.data);
    vScript();
  }, [props.data]);

  return null;
  // <script
  //   type="text/javascript"
  //   dangerouslySetInnerHTML={{ __html: props.data.join("") }}
  // />
};
MediaJavascript.defaultProps = {
  mediaType: "application/javascript",
};
