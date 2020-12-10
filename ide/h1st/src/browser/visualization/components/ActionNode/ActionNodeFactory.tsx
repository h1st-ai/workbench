import * as React from "react";
import { ActionNodeModel } from "./ActionNodeModel";
import { ActionNodeWidget } from "./ActionNodeWidget";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams";

export class ActionNodeFactory extends AbstractReactFactory<
  ActionNodeModel,
  DiagramEngine
> {
  constructor() {
    super("action-node");
  }

  generateModel(event: any) {
    return new ActionNodeModel(event);
  }

  generateReactWidget(event: any): JSX.Element {
    return <ActionNodeWidget engine={this.engine} node={event.model} />;
  }
}
