import * as React from "react";
import { ConditionNodeModel } from "./ConditionNodeModel";
import { ConditionNodeWidget } from "./ConditionNodeWidget";
import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams";

export class ConditionNodeFactory extends AbstractReactFactory<
  ConditionNodeModel,
  DiagramEngine
> {
  constructor() {
    super("condition-node");
  }

  generateModel(event: any) {
    return new ConditionNodeModel(event);
  }

  generateReactWidget(event: any): JSX.Element {
    return <ConditionNodeWidget engine={this.engine} node={event.model} />;
  }
}
