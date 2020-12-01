import { injectable, postConstruct } from "inversify";
import URI from "@theia/core/lib/common/uri";
import { Emitter, Event } from "@theia/core/lib/common";
import {
  WidgetOpenerOptions,
  NavigatableWidgetOpenHandler,
} from "@theia/core/lib/browser";
import { H1stNotebookWidget } from "./notebook-widget";
import { NotebookFactory } from "./notebook-factory";
// import { TextEditor } from './editor';

export interface NotebookOpenerOptions extends WidgetOpenerOptions {
  run?: boolean;
}

@injectable()
export class NotebookOpener extends NavigatableWidgetOpenHandler<
  H1stNotebookWidget
> {
  readonly id = NotebookFactory.ID;
  readonly label = "Notebook Editor";

  protected readonly onActiveEditorChangedEmitter = new Emitter<
    H1stNotebookWidget | undefined
  >();
  /**
   * Emit when the active editor is changed.
   */
  readonly onActiveEditorChanged: Event<H1stNotebookWidget | undefined> = this
    .onActiveEditorChangedEmitter.event;

  protected readonly onCurrentEditorChangedEmitter = new Emitter<
    H1stNotebookWidget | undefined
  >();
  /**
   * Emit when the current editor is changed.
   */
  readonly onCurrentEditorChanged: Event<H1stNotebookWidget | undefined> = this
    .onCurrentEditorChangedEmitter.event;

  @postConstruct()
  protected init(): void {
    super.init();
    this.shell.onDidChangeActiveWidget(() => this.updateActiveEditor());
    this.shell.onDidChangeCurrentWidget(() => this.updateCurrentEditor());
    this.onCreated((widget) => {
      widget.onDidChangeVisibility(() => {
        if (widget.isVisible) {
          this.addRecentlyVisible(widget);
        } else {
          this.removeRecentlyVisible(widget);
        }
        this.updateCurrentEditor();
      });
      widget.disposed.connect(() => {
        this.removeRecentlyVisible(widget);
        this.updateCurrentEditor();
      });
    });
    for (const widget of this.all) {
      if (widget.isVisible) {
        this.addRecentlyVisible(widget);
      }
    }
    this.updateCurrentEditor();
  }

  protected readonly recentlyVisibleIds: string[] = [];
  protected get recentlyVisible(): H1stNotebookWidget | undefined {
    const id = this.recentlyVisibleIds[0];
    return (id && this.all.find((w) => w.id === id)) || undefined;
  }
  protected addRecentlyVisible(widget: H1stNotebookWidget): void {
    this.removeRecentlyVisible(widget);
    this.recentlyVisibleIds.unshift(widget.id);
  }
  protected removeRecentlyVisible(widget: H1stNotebookWidget): void {
    const index = this.recentlyVisibleIds.indexOf(widget.id);
    if (index !== -1) {
      this.recentlyVisibleIds.splice(index, 1);
    }
  }

  protected _activeEditor: H1stNotebookWidget | undefined;
  /**
   * The active editor.
   * If there is an active editor (one that has focus), active and current are the same.
   */
  get activeEditor(): H1stNotebookWidget | undefined {
    return this._activeEditor;
  }
  protected setActiveEditor(active: H1stNotebookWidget | undefined): void {
    if (this._activeEditor !== active) {
      this._activeEditor = active;
      this.onActiveEditorChangedEmitter.fire(this._activeEditor);
    }
  }
  protected updateActiveEditor(): void {
    const widget = this.shell.activeWidget;
    this.setActiveEditor(
      widget instanceof H1stNotebookWidget ? widget : undefined
    );
  }

  protected _currentEditor: H1stNotebookWidget | undefined;
  /**
   * The most recently activated editor (which might not have the focus anymore, hence it is not active).
   * If no editor has focus, e.g. when a context menu is shown, the active editor is `undefined`, but current might be the editor that was active before the menu popped up.
   */
  get currentEditor(): H1stNotebookWidget | undefined {
    return this._currentEditor;
  }
  protected setCurrentEditor(current: H1stNotebookWidget | undefined): void {
    if (this._currentEditor !== current) {
      this._currentEditor = current;
      this.onCurrentEditorChangedEmitter.fire(this._currentEditor);
    }
  }
  protected updateCurrentEditor(): void {
    const widget = this.shell.currentWidget;
    if (widget instanceof H1stNotebookWidget) {
      this.setCurrentEditor(widget);
    } else if (!this._currentEditor || !this._currentEditor.isVisible) {
      this.setCurrentEditor(this.recentlyVisible);
    }
  }

  canHandle(uri: URI, options?: WidgetOpenerOptions): number {
    if (uri.path.ext.toLowerCase() === ".ipynb") {
      return 10000;
    }

    return 0;
  }

  async open(
    uri: URI,
    options?: NotebookOpenerOptions
  ): Promise<H1stNotebookWidget> {
    const editor = await super.open(uri, options);
    return editor;
  }
}
