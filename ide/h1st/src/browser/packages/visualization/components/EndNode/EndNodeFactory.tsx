import * as React from "react";
import { EndNodeModel } from "./EndNodeModel";
import { EndNodeWidget } from "./EndNodeWidget";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams";

export class EndNodeFactory extends AbstractReactFactory<
  EndNodeModel,
  DiagramEngine
> {
  constructor() {
    super("end-node");
  }

  generateModel(event: any) {
    return new EndNodeModel(event);
  }

  generateReactWidget(event: any): JSX.Element {
    return <EndNodeWidget engine={this.engine} node={event.model} />;
  }
}
