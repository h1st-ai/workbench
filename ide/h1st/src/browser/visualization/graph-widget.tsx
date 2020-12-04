import * as React from "react";
import {
  Message,
  NavigatableWidget,
  ReactWidget,
} from "@theia/core/lib/browser";
import { injectable } from "inversify";
import URI from "@theia/core/lib/common/uri";

@injectable()
export class H1stGraphWidget extends ReactWidget implements NavigatableWidget {
  static readonly ID = "h1st:graph:widget";

  constructor(readonly uri: URI) {
    super();
  }

  getResourceUri(): URI {
    return this.uri;
  }

  createMoveToUri(): URI {
    return this.uri;
  }

  protected async onAfterAttach(msg: Message): Promise<void> {
    super.onAfterAttach(msg);

    if (this.isVisible) {
      this.update();
    }
  }

  protected async onActivateRequest(msg: Message) {
    super.onActivateRequest(msg);
  }

  protected render(): React.ReactNode {
    return <p>Graph goes here</p>;
  }
}