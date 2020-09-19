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
import { FileService } from "@theia/filesystem/lib/browser/file-service";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Notebook from "./components/notebook";
import Icon from "./components/icon";
import reducer from "./reducers";
import { notebookActions } from "./reducers/notebook";

@injectable()
export class H1stNotebookWidget extends ReactWidget
  implements NavigatableWidget {
  static readonly ID = "h1st:notebook:widget";
  private readonly store: any;
  private _content: any;

  constructor(
    readonly uri: URI,
    protected readonly selectionService: SelectionService,
    protected readonly fileService: FileService
  ) {
    super();
    this.store = configureStore({ reducer, devTools: true });
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

  protected async onAfterAttach(msg: Message): Promise<void> {
    const content = await this.fileService.readFile(this.uri);

    try {
      this._content = JSON.parse(content.value.toString());
    } catch (ex) {
      this._content = defaultNotebookModel;
    }

    const { setCells } = notebookActions;
    this.store.dispatch(setCells({ cells: this._content.cells }));
    this.update();
    super.onAfterAttach(msg);
  }

  protected onActivateRequest(msg: Message) {
    console.log("activated", msg, this.uri);
    super.onActivateRequest(msg);
  }

  protected renderToolbar(): React.ReactNode {
    return (
      <div className="notebook-toolbar">
        <ul>
          <li>
            <Icon icon="fast-forward" width={16} height={16} />
          </li>
        </ul>
      </div>
    );
  }

  protected render(): React.ReactNode {
    // console.log(this._content);

    return (
      <React.Fragment>
        <Provider store={this.store}>
          <Notebook uri={this.uri} model={this._content} />
        </Provider>
      </React.Fragment>
    );
  }
}

const defaultNotebookModel = {
  cells: [
    {
      cell_type: "code",
      execution_count: null,
      metadata: {},
      outputs: [],
      source: [],
    },
  ],
  metadata: {
    language_info: {
      codemirror_mode: {
        name: "ipython",
        version: 3,
      },
      file_extension: ".py",
      mimetype: "text/x-python",
      name: "python",
      nbconvert_exporter: "python",
      pygments_lexer: "ipython3",
      version: "3.7.7-final",
    },
    orig_nbformat: 2,
    kernelspec: {
      name: "",
      display_name: "",
    },
  },
  nbformat: 4,
  nbformat_minor: 2,
};
