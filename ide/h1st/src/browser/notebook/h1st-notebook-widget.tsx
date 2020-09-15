import * as React from "react";
import {
  Navigatable,
  ReactWidget,
  Saveable,
  SaveableSource,
  StatefulWidget,
} from "@theia/core/lib/browser";
import { injectable } from "inversify";
import { Disposable, Event, SelectionService } from "@theia/core";
import { TextEditor } from "@theia/editor/lib/browser";
import URI from "@theia/core/lib/common/uri";

@injectable()
export class H1stNotebookWidget extends ReactWidget
  implements SaveableSource, Navigatable, StatefulWidget {
  static readonly ID = "h1st:notebook:widget";

  constructor(
    readonly editor: TextEditor,
    protected readonly selectionService: SelectionService
  ) {
    super(editor);
    this.addClass("theia-editor");
    this.toDispose.push(this.editor);
    this.toDispose.push(
      this.editor.onSelectionChanged(() => {
        if (this.editor.isFocused()) {
          this.selectionService.selection = this.editor;
        }
      })
    );
    this.toDispose.push(
      Disposable.create(() => {
        if (this.selectionService.selection === this.editor) {
          this.selectionService.selection = undefined;
        }
      })
    );
  }

  get onDispose(): Event<void> {
    return this.toDispose.onDispose;
  }

  get saveable(): Saveable {
    return this.editor.document;
  }

  storeState(): object {
    return {};
  }

  restoreState(oldState: object): void {
    console.log("restoring state", oldState);
  }

  getResourceUri(): URI | undefined {
    return this.editor.getResourceUri();
  }
  createMoveToUri(resourceUri: URI): URI | undefined {
    return this.editor.createMoveToUri(resourceUri);
  }

  render(): React.ReactChild {
    return <div>Notebook goes here</div>;
  }
}
