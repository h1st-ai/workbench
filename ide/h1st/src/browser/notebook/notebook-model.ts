import {
  Emitter,
  Event,
  // ResourceError,
} from "@theia/core";
import { Saveable } from "@theia/core/lib/browser";
import URI from "@theia/core/lib/common/uri";
import { FileService } from "@theia/filesystem/lib/browser/file-service";
import { H1stBackendWithClientService } from "../../common/protocol";
import { ICellModel } from "./types";

const uniqid = require("uniqid");

export class NotebookModel implements Saveable {
  autoSave: "on" | "off" = "on";
  autoSaveDelay: number = 500;

  protected _value: INotebookContent;
  protected readonly resolveModel: Promise<void>;

  constructor(
    protected readonly uri: URI,
    protected readonly fileService: FileService,
    protected readonly h1stBackendClient: H1stBackendWithClientService
  ) {
    this.resolveModel = this.readContents().then(
      (content) => {
        this.setValid(true);
        this.initialize(content?.toString());
      },
      () => {
        this.setValid(false);
      }
    );
  }

  protected _dirty = false;
  get dirty(): boolean {
    return this._dirty;
  }

  setDirty(value: boolean) {
    this._dirty = value;
    this.onDirtyChangedEmitter.fire();
  }

  get value(): INotebookContent {
    return this._value;
  }

  protected readonly onNotebookContentDidLoadEmitter = new Emitter<void>();
  get onNotebookContentLoad(): Event<void> {
    return this.onNotebookContentDidLoadEmitter.event;
  }

  protected readonly onDirtyChangedEmitter = new Emitter<void>();
  get onDirtyChanged(): Event<void> {
    return this.onDirtyChangedEmitter.event;
  }

  protected initialize(value: string | undefined): void {
    console.log("initialize value", value);
    if (value) {
      try {
        console.log("notebookContent", value);
        const notebookContent = JSON.parse(value);
        notebookContent.cells.map((c: ICellModel) => (c.id = uniqid()));
        this._value = notebookContent;

        // notify the notebook
        this.onNotebookContentDidLoadEmitter.fire();
      } catch (ex) {
        console.error(ex);
        this._value = defaultNotebookModel;
      }
    } else {
      this._value = defaultNotebookModel;
    }
  }

  /**
   * Use `valid` to access it.
   * Use `setValid` to mutate it.
   */
  protected _valid = false;
  /**
   * Whether it is possible to load content from the underlying resource.
   */
  get valid(): boolean {
    return this._valid;
  }

  async load(): Promise<NotebookModel> {
    await this.resolveModel;
    return this;
  }

  update(value: INotebookContent) {
    this._value.cells = value.cells;
  }

  private readContents = async () =>
    this.h1stBackendClient.getFileContent(this.uri.path.toString());

  protected readonly onDidChangeValidEmitter = new Emitter<void>();
  readonly onDidChangeValid = this.onDidChangeValidEmitter.event;

  protected setValid(valid: boolean): void {
    if (valid === this._valid) {
      return;
    }
    this._valid = valid;
    this.onDidChangeValidEmitter.fire(undefined);
  }

  async save(): Promise<void> {
    const validCells = this._value.cells.map((cell: any) => {
      const newCell = { ...cell };
      delete newCell.id;

      return newCell;
    });

    const savedContent = { ...this._value, cells: validCells };

    const content = JSON.stringify(savedContent, null, 4);

    await this.fileService.write(this.uri, content);

    this._dirty = false;

    this.onDirtyChangedEmitter.fire();
  }
}

const defaultNotebookModel = {
  cells: [
    {
      id: uniqid(),
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
      language: "python",
    },
  },
  nbformat: 4,
  nbformat_minor: 2,
};

type INotebookContent = {
  cells: any[];
  metadata: {
    session_id?: string;
    kernelspec: {
      display_name: string;
      language: string;
      name: string;
    };
    language_info: {
      codemirror_mode: {
        name: string;
        version: number;
      };
      file_extension: string;
      mimetype: string;
      name: string;
      nbconvert_exporter: string;
      pygments_lexer: string;
      version: string;
    };
  };
  nbformat: number;
  nbformat_minor: number;
};
