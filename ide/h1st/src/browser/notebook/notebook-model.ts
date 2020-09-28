import {
  DisposableCollection,
  Emitter,
  Event,
  Resource,
  ResourceError,
} from "@theia/core";
import { Saveable } from "@theia/core/lib/browser";
import nextId from "react-id-generator";
import { ICellModel } from "./types";

export class NotebookModel implements Saveable {
  autoSave: "on" | "off" = "on";
  autoSaveDelay: number = 500;

  protected _model: INotebookContent;
  protected readonly resolveModel: Promise<void>;

  protected readonly toDispose = new DisposableCollection();
  protected readonly toDisposeOnAutoSave = new DisposableCollection();

  constructor(protected readonly resource: Resource) {
    this.toDispose.push(resource);
    this.toDispose.push(this.toDisposeOnAutoSave);
    this.toDispose.push(this.onDirtyChangedEmitter);

    this.resolveModel = this.readContents().then((content) =>
      this.initialize(content?.toString())
    );
  }

  protected _dirty = false;
  get dirty(): boolean {
    return this._dirty;
  }

  set dirty(value: boolean) {
    this._dirty = true;
  }

  get value(): any {
    return this._model;
  }

  protected readonly onDirtyChangedEmitter = new Emitter<void>();
  get onDirtyChanged(): Event<void> {
    return this.onDirtyChangedEmitter.event;
  }

  protected initialize(value: string | undefined): void {
    if (value) {
      try {
        console.log("notebookContent", value);
        const notebookContent = JSON.parse(value);
        notebookContent.cells.map((c: ICellModel) => (c.id = nextId()));
        this._model = notebookContent;
      } catch (ex) {
        console.error(ex);
        this._model = defaultNotebookModel;
      }
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
    this._model.cells = value.cells;
    this._dirty = true;
  }

  protected async readContents(): Promise<
    string | monaco.editor.ITextBufferFactory | undefined
  > {
    try {
      const options = { encoding: "utf-8" };
      const content = await (this.resource.readStream
        ? this.resource.readStream(options)
        : this.resource.readContents(options));

      this.setValid(true);
      return content.toString();
    } catch (e) {
      this.setValid(false);
      if (ResourceError.NotFound.is(e)) {
        return undefined;
      }
      throw e;
    }
  }

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
    console.log("Saving notebook", this.resource, this._model);
    const content = JSON.stringify(this._model, null, 4);
    const contentLength = content.length;

    return await Resource.save(this.resource, {
      content,
      contentLength,
    });
  }
}

const defaultNotebookModel = {
  cells: [
    {
      id: nextId(),
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
