import { injectable, postConstruct } from "inversify";
import URI from "@theia/core/lib/common/uri";
import { Emitter, Event } from "@theia/core/lib/common";
import {
  WidgetOpenerOptions,
  NavigatableWidgetOpenHandler,
} from "@theia/core/lib/browser";
import { H1stGraphWidget } from "./graph-widget";
import { GraphFactory } from "./graph-factory";
// import { TextEditor } from './editor';

export interface GraphOpenerOptions extends WidgetOpenerOptions {
  run?: boolean;
}

@injectable()
export class GraphOpener extends NavigatableWidgetOpenHandler<H1stGraphWidget> {
  readonly id = GraphFactory.ID;
  readonly label = "Visualize";

  protected readonly onActiveEditorChangedEmitter = new Emitter<
    H1stGraphWidget | undefined
  >();
  /**
   * Emit when the active editor is changed.
   */
  readonly onActiveEditorChanged: Event<H1stGraphWidget | undefined> = this
    .onActiveEditorChangedEmitter.event;

  protected readonly onCurrentEditorChangedEmitter = new Emitter<
    H1stGraphWidget | undefined
  >();
  /**
   * Emit when the current editor is changed.
   */
  readonly onCurrentEditorChanged: Event<H1stGraphWidget | undefined> = this
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
  protected get recentlyVisible(): H1stGraphWidget | undefined {
    const id = this.recentlyVisibleIds[0];
    return (id && this.all.find((w) => w.id === id)) || undefined;
  }
  protected addRecentlyVisible(widget: H1stGraphWidget): void {
    this.removeRecentlyVisible(widget);
    this.recentlyVisibleIds.unshift(widget.id);
  }
  protected removeRecentlyVisible(widget: H1stGraphWidget): void {
    const index = this.recentlyVisibleIds.indexOf(widget.id);
    if (index !== -1) {
      this.recentlyVisibleIds.splice(index, 1);
    }
  }

  protected _activeEditor: H1stGraphWidget | undefined;
  /**
   * The active editor.
   * If there is an active editor (one that has focus), active and current are the same.
   */
  get activeEditor(): H1stGraphWidget | undefined {
    return this._activeEditor;
  }
  protected setActiveEditor(active: H1stGraphWidget | undefined): void {
    if (this._activeEditor !== active) {
      this._activeEditor = active;
      this.onActiveEditorChangedEmitter.fire(this._activeEditor);
    }
  }
  protected updateActiveEditor(): void {
    const widget = this.shell.activeWidget;
    this.setActiveEditor(
      widget instanceof H1stGraphWidget ? widget : undefined
    );
  }

  protected _currentEditor: H1stGraphWidget | undefined;
  /**
   * The most recently activated editor (which might not have the focus anymore, hence it is not active).
   * If no editor has focus, e.g. when a context menu is shown, the active editor is `undefined`, but current might be the editor that was active before the menu popped up.
   */
  get currentEditor(): H1stGraphWidget | undefined {
    return this._currentEditor;
  }
  protected setCurrentEditor(current: H1stGraphWidget | undefined): void {
    if (this._currentEditor !== current) {
      this._currentEditor = current;
      this.onCurrentEditorChangedEmitter.fire(this._currentEditor);
    }
  }
  protected updateCurrentEditor(): void {
    const widget = this.shell.currentWidget;
    if (widget instanceof H1stGraphWidget) {
      this.setCurrentEditor(widget);
    } else if (!this._currentEditor || !this._currentEditor.isVisible) {
      this.setCurrentEditor(this.recentlyVisible);
    }
  }

  canHandle(uri: URI, options?: WidgetOpenerOptions): number {
    if (uri.path.ext.toLowerCase() === ".py") {
      return 1;
    }

    return 0;
  }

  async open(uri: URI, options?: GraphOpenerOptions): Promise<H1stGraphWidget> {
    const editor = await super.open(uri, options);
    return editor;
  }
}
