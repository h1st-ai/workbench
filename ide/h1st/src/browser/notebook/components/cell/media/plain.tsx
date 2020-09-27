import * as React from "react";

export const Plain = (props: any) => {
  const ref = React.useRef<HTMLPreElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.innerText = props.data;
    }
  }, [props.data]);

  return <pre ref={ref} />;
};
Plain.defaultProps = {
  mediaType: "text/plain",
};
