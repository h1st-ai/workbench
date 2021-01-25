import * as React from "react";
import { CustomtLabelModel } from "./CustomLabelModel";
import { CustomLabelWidget } from "./CustomLabelWidget";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";

/**
 * @author Dylan Vorster
 */
export class CustomLabelFactory extends AbstractReactFactory<
  CustomtLabelModel,
  DiagramEngine
> {
  constructor() {
    super("custom-label");
  }

  generateReactWidget(event: any): JSX.Element {
    return <CustomLabelWidget model={event.model} />;
  }

  generateModel(event: any): CustomtLabelModel {
    return new CustomtLabelModel();
  }
}
