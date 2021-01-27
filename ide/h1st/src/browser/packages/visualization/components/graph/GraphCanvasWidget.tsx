import * as React from "react";
import styled from "@emotion/styled";

export interface GraphCanvasWidgetProps {
  color?: string;
  background?: string;
}

export const Container = styled.div<{ color: string; background: string }>`
  height: 100vh;
  background-color: ${(p) => p.background};
  background-size: 50px 50px;
  display: flex;
  > * {
    height: 100%;
    min-height: 100%;
    width: 100%;
  }
`;

export class GraphCanvasWidget extends React.Component<GraphCanvasWidgetProps> {
  render() {
    return (
      <Container
        background={"white"}
        color={this.props.color || "rgba(255,255,255, 0.05)"}
      >
        {this.props.children}
      </Container>
    );
  }
}
