import { NodeModel } from "@projectstorm/react-diagrams";
import { AdvancedPortModel } from "../DirectedLink";

/**
 * Example of a custom model using pure javascript
 */
export class ActionNodeModel extends NodeModel {
  private color: any;
  constructor(options: { color?: string; name?: string } = { color: "red" }) {
    super({
      ...options,
      type: "action-node",
    });
    this.color = options.color ?? "red";

    // setup an in and out port
    this.addPort(
      new AdvancedPortModel({
        in: true,
        name: "in",
      })
    );
    this.addPort(
      new AdvancedPortModel({
        in: false,
        name: "out",
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
