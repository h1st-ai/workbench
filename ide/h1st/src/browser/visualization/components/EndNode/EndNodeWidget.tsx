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
          <text x="35" y="57" fill="white">End</text>`,
        }}
      ></svg>
      <PortWidget
        engine={props.engine}
        port={props.node.getPort("in")}
        style={{
          // left: props.size - 8,
          // top: -10,
          top: 0,
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

export { EndNodeWidget };
