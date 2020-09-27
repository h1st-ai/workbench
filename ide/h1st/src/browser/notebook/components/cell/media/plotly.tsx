import * as React from "react";
const PlotlyAPI = require("plotly.js-dist");

export const MediaPlotly = (props: any) => {
  const divRef = React.useRef<any>();

  React.useEffect(() => {
    if (divRef && divRef.current) {
      console.log(`rendering plotly chart`);
      // data is read only so we need to clone it
      const data = JSON.parse(JSON.stringify(props.data));
      PlotlyAPI.plot(divRef.current, data);
    }
  }, [props.data]);

  return <div ref={divRef} className="output-plotly" />;
};

MediaPlotly.defaultProps = {
  mediaType: "application/vnd.plotly.v1+json",
};
