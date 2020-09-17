import * as React from "react";
import {
  Message,
  NavigatableWidget,
  // NavigatableWidget,
  // Navigatable,
  ReactWidget,
  // Saveable,
  // SaveableSource,
  // StatefulWidget,
  // ReactRenderer,
} from "@theia/core/lib/browser";
import { injectable } from "inversify";
import URI from "@theia/core/lib/common/uri";
import { SelectionService } from "@theia/core";
// import URI from "@theia/core/lib/common/uri";
// import { Disposable, Event, SelectionService } from "@theia/core";
// import { TextEditor } from "@theia/editor/lib/browser";
// import URI from "@theia/core/lib/common/uri";

@injectable()
export class H1stNotebookWidget extends ReactWidget
  implements NavigatableWidget {
  static readonly ID = "h1st:notebook:widget";

  constructor(
    readonly uri: URI,
    protected readonly selectionService: SelectionService //
  ) {
    super();
  }

  // get onDispose(): Event<void> {
  //   return this.toDispose.onDispose;
  // }

  // get saveable(): Saveable {
  //   return this.editor.document;
  // }

  // storeState(): object {
  //   return {};
  // }

  // restoreState(oldState: object): void {
  //   console.log("restoring state", oldState);
  // }

  getResourceUri(): URI | undefined {
    return this.uri;
  }
  createMoveToUri(resourceUri: URI): URI | undefined {
    return new URI("test2");
  }

  protected onAfterAttach(msg: Message): void {
    this.update();
    super.onAfterAttach(msg);
  }

  protected onActivateRequest(msg: Message) {
    console.log("activated", msg, this.uri);
    super.onActivateRequest(msg);
  }

  protected render(): React.ReactNode {
    return (
      <React.Fragment>
        <div>Notebook goes here {this.uri.toString()}</div>
      </React.Fragment>
    );
  }
}
