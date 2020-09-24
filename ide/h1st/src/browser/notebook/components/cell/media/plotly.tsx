import * as React from "react";
const Plotly = require("plotly.js-dist");

export const MediaPlotly = (props: any) => {
  const divRef = React.useRef<any>();

  React.useEffect(() => {
    if (divRef && divRef.current) {
      // data is read only so we need to clone it
      const data = JSON.parse(JSON.stringify(props.data));
      Plotly.plot(divRef.current, data);
    }
  });

  return <div ref={divRef} className="output-plotly" />;
};

MediaPlotly.defaultProps = {
  mediaType: "application/vnd.plotly.v1+json",
};
