import {
  LabelModelGenerics,
  LabelModelOptions,
} from "@projectstorm/react-diagrams-core";
import { DefaultLabelModel } from "@projectstorm/react-diagrams";

export interface DefaultLabelModelOptions extends LabelModelOptions {
  label?: string;
}

export interface DefaultLabelModelGenerics extends LabelModelGenerics {
  OPTIONS: DefaultLabelModelOptions;
}

export class CustomtLabelModel extends DefaultLabelModel {
  constructor(options: DefaultLabelModelOptions = {}) {
    console.log("options crate label", options);
    super({
      offsetY: options.offsetY == null ? -23 : options.offsetY,
      type: "custom-label",
      ...options,
    });
  }
}
