import * as React from "react";

export const MediaSVG = (props: any) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = props.data.join("");
    }
  }, [props.data]);

  return (
    <div className="cell-output-plot-background">
      <div className="output-svg" ref={containerRef} />
    </div>
  );
};

MediaSVG.defaultProps = {
  mediaType: "image/svg+xml",
};
