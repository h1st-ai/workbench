import * as React from "react";
const PlotlyAPI = require("plotly.js-dist");

const Plotly = (props: any) => {
  const divRef = React.useRef<any>();

  React.useEffect(() => {
    if (divRef && divRef.current) {
      console.log(`rendering plotly chart`);
      // data is read only so we need to clone it
      const data = JSON.parse(JSON.stringify(props.data));
      PlotlyAPI.plot(divRef.current, data);
    }
  });

  return <div ref={divRef} className="output-plotly" />;
};

Plotly.defaultProps = {
  mediaType: "application/vnd.plotly.v1+json",
};

export const MediaPlotly = React.memo(Plotly);
