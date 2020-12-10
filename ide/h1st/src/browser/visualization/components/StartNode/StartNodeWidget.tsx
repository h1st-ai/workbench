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
          <text x="32" y="57" fill="#2241B0">Start</text>`,
        }}
      ></svg>
      <PortWidget
        engine={props.engine}
        port={props.node.getPort("out")}
        style={{
          // left: props.size - 8,
          // top: -10,
          bottom: 0,
          left: "50%",
          position: "absolute",
        }}
      >
        <div
          className="circle-port"
          style={
            {
              // width: 10,
              // height: 10,
              // borderRadius: 10,
              // border: "1px solid blue",
              // marginLeft: "-50%",
            }
          }
        />
      </PortWidget>
    </div>
  );
};

export { StartNodeWidget };
