import * as React from "react";

export const MediaHTML = (props: any) => {
  const divRef = React.useRef<any>();

  React.useEffect(() => {
    if (divRef && divRef.current) {
      divRef.current.innerHTML = Array.isArray(props.data)
        ? props.data.join("")
        : props.data;
    }
  }, [props.data]);

  return <div ref={divRef} className="output-html" />;
};

MediaHTML.defaultProps = {
  mediaType: "text/html",
};
