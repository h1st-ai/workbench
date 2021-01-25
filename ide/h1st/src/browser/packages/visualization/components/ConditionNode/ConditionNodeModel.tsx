import { NodeModel } from "@projectstorm/react-diagrams";
import { AdvancedPortModel } from "../DirectedLink";

/**
 * Example of a custom model using pure javascript
 */
export class ConditionNodeModel extends NodeModel {
  private color: any;
  constructor(options: { color?: string; name?: string } = { color: "red" }) {
    super({
      ...options,
      type: "condition-node",
    });
    this.color = options.color ?? "red";

    this.addPort(
      new AdvancedPortModel({
        in: true,
        name: "in",
      })
    );

    this.addPort(
      new AdvancedPortModel({
        label: "outYes",
        in: false,
        name: "outYes",
      })
    );

    this.addPort(
      new AdvancedPortModel({
        in: false,
        name: "outNo",
      })
    );
  }

  serialize() {
    return {
      ...super.serialize(),
      color: this.color,
    };
  }

  deserialize(ob: any) {
    super.deserialize(ob);
    this.color = ob.color;
  }
}
