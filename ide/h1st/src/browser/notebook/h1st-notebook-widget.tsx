import * as React from "react";
import {
  Message,
  NavigatableWidget,
  // NavigatableWidget,
  // Navigatable,
  ReactWidget,
  Widget,
  // Saveable,
  // SaveableSource,
  // StatefulWidget,
  // ReactRenderer,
} from "@theia/core/lib/browser";
import { injectable } from "inversify";
import URI from "@theia/core/lib/common/uri";
import { SelectionService } from "@theia/core";
import { FileService } from "@theia/filesystem/lib/browser/file-service";
import nextId from "react-id-generator";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Notebook from "./components/notebook";
// import Icon from "./components/icon";
import reducer from "./reducers";
import { notebookActions } from "./reducers/notebook";
import { ICellModel } from "./types";
import { ThemeService } from "@theia/core/lib/browser/theming";

@injectable()
export class H1stNotebookWidget extends ReactWidget
  implements NavigatableWidget {
  static readonly ID = "h1st:notebook:widget";
  private readonly store: any;
  private _content: any;
  private _width: number;
  private _height: number;

  constructor(
    readonly uri: URI,
    protected readonly selectionService: SelectionService,
    protected readonly fileService: FileService,
    protected readonly themeService: ThemeService
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

  protected onResize(msg: Widget.ResizeMessage): void {
    // if (msg.width < 0 || msg.height < 0) {
    //     this.editor.resizeToFit();
    // } else {
    //     this.editor.setSize(msg);
    // }
    const { width, height } = msg;
    this._width = width;
    this._height = height;
    this.update();
  }

  protected async onAfterAttach(msg: Message): Promise<void> {
    const content = await this.fileService.readFile(this.uri);

    try {
      const _content = JSON.parse(content.value.toString());
      _content.cells.map((c: ICellModel) => (c.id = nextId("h1st")));

      this._content = _content;
    } catch (ex) {
      this._content = defaultNotebookModel;
    }

    const { setCells, setActiveTheme } = notebookActions;
    this.store.dispatch(setCells({ cells: this._content.cells }));

    const currentTheme = this.themeService.getCurrentTheme();
    this.store.dispatch(setActiveTheme(currentTheme));

    this.update();
    super.onAfterAttach(msg);
  }

  protected onActivateRequest(msg: Message) {
    console.log("activated", msg, this.uri);
    super.onActivateRequest(msg);
    this.update();
  }

  // protected renderToolbar(): React.ReactNode {
  //   return (
  //     <div className="notebook-toolbar">
  //       <ul>
  //         <li>
  //           <Icon icon="fast-forward" width={16} height={16} />
  //         </li>
  //       </ul>
  //     </div>
  //   );
  // }

  protected render(): React.ReactNode {
    return (
      <React.Fragment>
        <Provider store={this.store}>
          <Notebook
            uri={this.uri}
            model={this._content}
            width={this._width}
            height={this._height}
          />
        </Provider>
      </React.Fragment>
    );
  }
}

const defaultNotebookModel = {
  cells: [
    {
      id: nextId("h1st"),
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
