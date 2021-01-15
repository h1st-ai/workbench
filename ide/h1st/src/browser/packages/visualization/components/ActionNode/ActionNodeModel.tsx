import { NodeModel } from '@projectstorm/react-diagrams';
import { AdvancedPortModel } from '../DirectedLink';

/**
 * Example of a custom model using pure javascript
 */
export class ActionNodeModel extends NodeModel {
  private color: any;
  private subModels?: string[];
  constructor(
    options: { color?: string; name?: string; subModels?: string[] } = {
      color: 'red',
    },
  ) {
    super({
      ...options,
      type: 'action-node',
    });
    this.color = options.color ?? 'red';
    this.subModels = options.subModels;

    // setup an in and out port
    this.addPort(
      new AdvancedPortModel({
        in: true,
        name: 'in',
      }),
    );
    this.addPort(
      new AdvancedPortModel({
        in: false,
        name: 'out',
      }),
    );
  }

  serialize() {
    return {
      ...super.serialize(),
      color: this.color,
      subModels: this.subModels,
    };
  }

  deserialize(ob: any) {
    super.deserialize(ob);
    this.color = ob.color;
  }
}
