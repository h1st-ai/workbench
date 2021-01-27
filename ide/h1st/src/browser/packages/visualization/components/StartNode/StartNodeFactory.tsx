import * as React from "react";
import { StartNodeModel } from "./StartNodeModel";
import { StartNodeWidget } from "./StartNodeWidget";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams";

export class StartNodeFactory extends AbstractReactFactory<
  StartNodeModel,
  DiagramEngine
> {
  constructor() {
    super("start-node");
  }

  generateModel(event: any) {
    return new StartNodeModel(event);
  }

  generateReactWidget(event: any): JSX.Element {
    return <StartNodeWidget engine={this.engine} node={event.model} />;
  }
}
