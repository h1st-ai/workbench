import * as React from "react";

export const MediaUnsupported = (props: any) => {
  const ref = React.useRef<HTMLPreElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = `mimetype not support. Please notify the dev teams. \n ${JSON.stringify(
        props.data,
        null,
        4
      )}`;
    }
  }, [props.data]);

  return <pre ref={ref} />;
};
