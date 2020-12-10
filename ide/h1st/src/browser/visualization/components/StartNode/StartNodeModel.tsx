import { NodeModel } from "@projectstorm/react-diagrams";
import { AdvancedPortModel } from "../DirectedLink";

/**
 * Example of a custom model using pure javascript
 */
export class StartNodeModel extends NodeModel {
  private color: any;
  constructor(options = {}) {
    super({
      ...options,
      type: "start-node",
    });

    // Start node only has outport
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
