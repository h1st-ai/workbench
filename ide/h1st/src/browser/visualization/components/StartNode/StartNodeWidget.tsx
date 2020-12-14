import { PortWidget } from "@projectstorm/react-diagrams";
import * as React from "react";

const StartNodeWidget = (props: any) => {
  return (
    <div className="start-node" style={{ width: 100, height: 100 }}>
      <svg
        width={"100%"}
        height={"100%"}
        dangerouslySetInnerHTML={{
          __html: `<circle cx="50" cy="50" r="45" stroke="#2241B0" stroke-width="2" fill="white" />
          <text x="50%" y="55%" fill="#2241B0" style="font: 14px sans-serif; white-space: pre-line;
          text-anchor: middle;">Start</text>`,
        }}
      ></svg>
      <PortWidget
        engine={props.engine}
        port={props.node.getPort("out")}
        style={{
          bottom: 0,
          left: "50%",
          position: "absolute",
        }}
      >
        <div className="circle-port" />
      </PortWidget>
    </div>
  );
};

export { StartNodeWidget };
