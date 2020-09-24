import * as React from "react";

export const MediaHTML = (props: any) => {
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
