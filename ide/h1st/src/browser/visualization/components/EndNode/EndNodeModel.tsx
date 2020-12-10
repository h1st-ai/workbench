import { NodeModel } from "@projectstorm/react-diagrams";
import { AdvancedPortModel } from "../DirectedLink";

/**
 * Example of a custom model using pure javascript
 */
export class EndNodeModel extends NodeModel {
  private color: any;
  constructor(options = {}) {
    super({
      ...options,
      type: "end-node",
    });

    // Start node only has outport
    this.addPort(
      new AdvancedPortModel({
        in: true,
        name: "in",
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
