import { PortWidget } from "@projectstorm/react-diagrams";
import * as React from "react";

const ConditionNodeWidget = (props: any) => {
  return (
    <div className="start-node">
      <svg
        width={200}
        height={122}
        dangerouslySetInnerHTML={{
          __html: `<g>
          <path d="M 1 60 L 100 0 L 200 60 L 100 120 Z" fill="#ffffff" stroke="#2241B0" stroke-width="2" stroke-miterlimit="10" pointer-events="all"></path>
          </g>`,
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
              // borderRadius: 10,
              // border: "1px solid blue",
              // marginLeft: "-50%",
            }
          }
        />
      </PortWidget>
      <PortWidget
        engine={props.engine}
        port={props.node.getPort("outYes")}
        style={{
          // left: props.size - 8,
          // top: -10,
          top: "48%",
          left: 0,
          position: "absolute",
        }}
      >
        <div
          className="circle-port"
          style={
            {
              // width: 10,
              // height: 10,
            }
          }
        />
      </PortWidget>
      <PortWidget
        engine={props.engine}
        port={props.node.getPort("outNo")}
        style={{
          // left: props.size - 8,
          // top: -10,
          top: "48%",
          right: 0,
          position: "absolute",
        }}
      >
        <div
          className="circle-port"
          style={
            {
              // width: 10,
              // height: 10,
            }
          }
        />
      </PortWidget>
    </div>
  );
};

export { ConditionNodeWidget };
