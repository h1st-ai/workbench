import * as React from "react";
import { ReactWidget } from "@theia/core/lib/browser";
import { injectable } from "inversify";

@injectable()
export class ExperimentWidget extends ReactWidget {
  private _name: string = "";

  constructor(name: string) {
    super();
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  onActivateRequest() {
    this.update();
  }

  render(): React.ReactNode {
    return <p>Widget</p>;
  }
}
