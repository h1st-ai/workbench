import * as React from "react";
import {
  Message,
  NavigatableWidget,
  ReactWidget,
} from "@theia/core/lib/browser";
import { injectable } from "inversify";
import URI from "@theia/core/lib/common/uri";
// import { GraphContainer } from "./containers/GrapphContainer";
// import { configureStore } from "@reduxjs/toolkit";
// import reducer from "./reducers";
import DiagramGraph from "./components/graph/DiagramGraph";

@injectable()
export class H1stGraphWidget extends ReactWidget implements NavigatableWidget {
  static readonly ID = "h1st:graph:widget";
  // private readonly store: any;

  constructor(readonly uri: URI) {
    super();
    // Init store from Widget
    // this.store = configureStore({ reducer, devTools: true });
  }

  getResourceUri(): URI {
    return this.uri;
  }

  createMoveToUri(): URI {
    return this.uri;
  }

  protected async onAfterAttach(msg: Message): Promise<void> {
    super.onAfterAttach(msg);

    console.log("On after attach", msg, this.isVisible);
    this.update();
  }

  protected async onActivateRequest(msg: Message) {
    super.onActivateRequest(msg);
  }

  protected render(): React.ReactNode {
    return (
      <div className="h1st-graph" style={{ height: "100%" }}>
        <DiagramGraph
        //  store={this.store}
        />
      </div>
    );
  }
}
