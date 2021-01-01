import { injectable, postConstruct } from 'inversify';
import URI from '@theia/core/lib/common/uri';
import { Emitter, Event } from '@theia/core/lib/common';
import {
  WidgetOpenerOptions,
  NavigatableWidgetOpenHandler,
} from '@theia/core/lib/browser';
import { ExperimentWidget } from './expriment-widget';
import { ExperimentWidgetFactory } from './experiment-widget-factory';
import { TuningUris } from './experiment-uris';
// import { TextEditor } from './editor';

export interface TuningOpenerOptions extends WidgetOpenerOptions {
  run?: boolean;
}

@injectable()
export class TuningOpener extends NavigatableWidgetOpenHandler<
  ExperimentWidget
> {
  readonly id = ExperimentWidgetFactory.ID;
  readonly label = 'Tuning Editor';

  protected readonly onActiveEditorChangedEmitter = new Emitter<
    ExperimentWidget | undefined
  >();
  /**
   * Emit when the active editor is changed.
   */
  readonly onActiveEditorChanged: Event<ExperimentWidget | undefined> = this
    .onActiveEditorChangedEmitter.event;

  protected readonly onCurrentEditorChangedEmitter = new Emitter<
    ExperimentWidget | undefined
  >();
  /**
   * Emit when the current editor is changed.
   */
  readonly onCurrentEditorChanged: Event<ExperimentWidget | undefined> = this
    .onCurrentEditorChangedEmitter.event;

  @postConstruct()
  protected init(): void {
    super.init();
    this.shell.onDidChangeActiveWidget(() => this.updateActiveEditor());
    this.shell.onDidChangeCurrentWidget(() => this.updateCurrentEditor());
    this.onCreated(widget => {
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
  protected get recentlyVisible(): ExperimentWidget | undefined {
    const id = this.recentlyVisibleIds[0];
    return (id && this.all.find(w => w.id === id)) || undefined;
  }
  protected addRecentlyVisible(widget: ExperimentWidget): void {
    this.removeRecentlyVisible(widget);
    this.recentlyVisibleIds.unshift(widget.id);
  }
  protected removeRecentlyVisible(widget: ExperimentWidget): void {
    const index = this.recentlyVisibleIds.indexOf(widget.id);
    if (index !== -1) {
      this.recentlyVisibleIds.splice(index, 1);
    }
  }

  protected _activeEditor: ExperimentWidget | undefined;
  /**
   * The active editor.
   * If there is an active editor (one that has focus), active and current are the same.
   */
  get activeEditor(): ExperimentWidget | undefined {
    return this._activeEditor;
  }
  protected setActiveEditor(active: ExperimentWidget | undefined): void {
    if (this._activeEditor !== active) {
      this._activeEditor = active;
      this.onActiveEditorChangedEmitter.fire(this._activeEditor);
    }
  }
  protected updateActiveEditor(): void {
    const widget = this.shell.activeWidget;
    this.setActiveEditor(
      widget instanceof ExperimentWidget ? widget : undefined,
    );
  }

  protected _currentEditor: ExperimentWidget | undefined;
  /**
   * The most recently activated editor (which might not have the focus anymore, hence it is not active).
   * If no editor has focus, e.g. when a context menu is shown, the active editor is `undefined`, but current might be the editor that was active before the menu popped up.
   */
  get currentEditor(): ExperimentWidget | undefined {
    return this._currentEditor;
  }
  protected setCurrentEditor(current: ExperimentWidget | undefined): void {
    if (this._currentEditor !== current) {
      this._currentEditor = current;
      this.onCurrentEditorChangedEmitter.fire(this._currentEditor);
    }
  }
  protected updateCurrentEditor(): void {
    const widget = this.shell.currentWidget;
    if (widget instanceof ExperimentWidget) {
      this.setCurrentEditor(widget);
    } else if (!this._currentEditor || !this._currentEditor.isVisible) {
      this.setCurrentEditor(this.recentlyVisible);
    }
  }

  canHandle(uri: URI, options?: WidgetOpenerOptions): number {
    if (uri.scheme.toLowerCase() === TuningUris.TUNING_SCHEME) {
      return 10000;
    }

    return 0;
  }

  async open(
    uri: URI,
    options?: TuningOpenerOptions,
  ): Promise<ExperimentWidget> {
    console.log('opening tuning uri', uri, options);
    const editor = await super.open(uri, options);
    return editor;
  }
}
