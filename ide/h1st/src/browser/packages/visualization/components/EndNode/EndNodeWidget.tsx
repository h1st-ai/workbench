import { PortWidget } from "@projectstorm/react-diagrams";
import * as React from "react";

const EndNodeWidget = (props: any) => {
  return (
    <div className="start-node" style={{ width: 100, height: 100 }}>
      <svg
        width={"100%"}
        height={"100%"}
        dangerouslySetInnerHTML={{
          __html: `<circle cx="50" cy="50" r="45"  fill="#2241B0" />
          <text x="50%" y="55%" fill="white" style="font: 14px sans-serif; white-space: pre-line;
          text-anchor: middle;">End</text>`,
        }}
      ></svg>
      <PortWidget
        engine={props.engine}
        port={props.node.getPort("in")}
        style={{
          top: 0,
          left: "50%",
          position: "absolute",
        }}
      >
        <div className="circle-port" />
      </PortWidget>
    </div>
  );
};

export { EndNodeWidget };
