import * as React from "react";
import { CustomtLabelModel } from "./CustomLabelModel";
import styled from "@emotion/styled";
import { DefaultLabelWidget } from "@projectstorm/react-diagrams";

export interface DefaultLabelWidgetProps {
  model: CustomtLabelModel;
}

export const Label = styled.div`
  /* background: rgba(0, 0, 0, 0.8); */
  /* border: 2px solid #2241b0; */

  border-radius: 5px;
  color: #2241b0;
  font-size: 12px;
  /* padding: 4px 8px; */
  font-family: sans-serif;
  user-select: none;
`;

export class CustomLabelWidget extends DefaultLabelWidget {
  render() {
    return <Label>{this.props.model.getOptions().label}</Label>;
  }
}
