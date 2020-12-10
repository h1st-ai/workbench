import { PortWidget } from "@projectstorm/react-diagrams";
import * as React from "react";

const ActionNodeWidget = (props: any) => {
  return (
    <div
      className="action-node"
      style={{
        padding: 12,
        border: "2px solid #2241B0",
        borderRadius: 5,
      }}
    >
      {props?.node?.options?.name}
      <PortWidget
        engine={props.engine}
        port={props.node.getPort("in")}
        style={{
          // left: props.size - 8,
          // top: -10,
          top: -5,
          left: "50%",
          position: "absolute",
        }}
      >
        <div
          className="circle-port"
          style={{
            width: 10,
            height: 10,
            // marginLeft: "-50%",
          }}
        />
      </PortWidget>
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
          style={{
            left: props.size / 2 - 8,
            top: props.size - 8,
            position: "absolute",
            width: 10,
            height: 10,
          }}
        />
      </PortWidget>
    </div>
  );
};

export { ActionNodeWidget };
