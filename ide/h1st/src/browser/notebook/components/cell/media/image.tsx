import * as React from "react";

export const MediaPNG = (props: any) => {
  const ref = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.src = `data:${props.mediatype};base64,${props.data}`;
    }
  }, [props.data]);

  return (
    <div className="cell-output-plot-background">
      <img ref={ref} alt="" />
    </div>
  );
};

MediaPNG.defaultProps = {
  mediaType: "image/png",
};

export const MediaJPG = (props: any) => {
  const ref = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.src = `data:${props.mediatype};base64,${props.data}`;
    }
  }, [props.data]);

  return (
    <div className="cell-output-plot-background">
      <img ref={ref} alt="" />
    </div>
  );
};

MediaJPG.defaultProps = {
  mediaType: "image/jpeg",
};

export const MediaGIF = (props: any) => {
  const ref = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.src = `data:${props.mediatype};base64,${props.data}`;
    }
  }, [props.data]);

  return (
    <div className="cell-output-plot-background">
      <img ref={ref} alt="" />
    </div>
  );
};

MediaGIF.defaultProps = {
  mediaType: "image/gif",
};
