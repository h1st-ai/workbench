import * as React from "react";
import {
  Message,
  // NavigatableWidget,
  // Navigatable,
  ReactWidget,
  // Saveable,
  // SaveableSource,
  // StatefulWidget,
} from "@theia/core/lib/browser";
import { injectable, postConstruct } from "inversify";
// import URI from "@theia/core/lib/common/uri";
// import { Disposable, Event, SelectionService } from "@theia/core";
// import { TextEditor } from "@theia/editor/lib/browser";
// import URI from "@theia/core/lib/common/uri";

@injectable()
export class H1stNotebookWidget extends ReactWidget {
  static readonly ID = "h1st:notebook:widget";

  // constructor() // readonly uri: URI
  // readonly editor: TextEditor,
  // protected readonly selectionService: SelectionService
  // {
  // super();
  // }

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

  // getResourceUri(): URI | undefined {
  //   return this.uri;
  // }
  // createMoveToUri(resourceUri: URI): URI | undefined {
  //   return this.editor.createMoveToUri(resourceUri);
  // }

  @postConstruct()
  init(): void {
    this.id = H1stNotebookWidget.ID;
    this.title.caption = "Sample Unclosable View";
    this.title.label = "Sample Unclosable View";
    this.title.iconClass = "fa fa-window-maximize";
    this.title.closable = false;
    this.update();
  }

  protected onActivateRequest(msg: Message) {
    console.log("activated", msg);
  }

  protected render(): React.ReactNode {
    alert("render");
    return <div>Notebook goes here</div>;
  }
}
