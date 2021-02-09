import { injectable, postConstruct } from 'inversify';
import URI from '@theia/core/lib/common/uri';
import { Emitter, Event } from '@theia/core/lib/common';
import {
  WidgetOpenerOptions,
  NavigatableWidgetOpenHandler,
} from '@theia/core/lib/browser';
import { ServingUIWidget } from './serving-ui-widget';
import { ServingUIWidgetFactory } from './experiment-widget-factory';
import { AppTemplateUris } from './experiment-uris';
// import { TextEditor } from './editor';

export interface ServingOpenerOptions extends WidgetOpenerOptions {
  run?: boolean;
}

@injectable()
export class AppTemplateOpener extends NavigatableWidgetOpenHandler<
  ServingUIWidget
> {
  readonly id = ServingUIWidgetFactory.ID;
  readonly label = 'App Template';

  protected readonly onActiveEditorChangedEmitter = new Emitter<
    ServingUIWidget | undefined
  >();
  /**
   * Emit when the active editor is changed.
   */
  readonly onActiveEditorChanged: Event<ServingUIWidget | undefined> = this
    .onActiveEditorChangedEmitter.event;

  protected readonly onCurrentEditorChangedEmitter = new Emitter<
    ServingUIWidget | undefined
  >();
  /**
   * Emit when the current editor is changed.
   */
  readonly onCurrentEditorChanged: Event<ServingUIWidget | undefined> = this
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
  protected get recentlyVisible(): ServingUIWidget | undefined {
    const id = this.recentlyVisibleIds[0];
    return (id && this.all.find(w => w.id === id)) || undefined;
  }
  protected addRecentlyVisible(widget: ServingUIWidget): void {
    this.removeRecentlyVisible(widget);
    this.recentlyVisibleIds.unshift(widget.id);
  }
  protected removeRecentlyVisible(widget: ServingUIWidget): void {
    const index = this.recentlyVisibleIds.indexOf(widget.id);
    if (index !== -1) {
      this.recentlyVisibleIds.splice(index, 1);
    }
  }

  protected _activeEditor: ServingUIWidget | undefined;
  /**
   * The active editor.
   * If there is an active editor (one that has focus), active and current are the same.
   */
  get activeEditor(): ServingUIWidget | undefined {
    return this._activeEditor;
  }
  protected setActiveEditor(active: ServingUIWidget | undefined): void {
    if (this._activeEditor !== active) {
      this._activeEditor = active;
      this.onActiveEditorChangedEmitter.fire(this._activeEditor);
    }
  }
  protected updateActiveEditor(): void {
    const widget = this.shell.activeWidget;
    this.setActiveEditor(
      widget instanceof ServingUIWidget ? widget : undefined,
    );
  }

  protected _currentEditor: ServingUIWidget | undefined;
  /**
   * The most recently activated editor (which might not have the focus anymore, hence it is not active).
   * If no editor has focus, e.g. when a context menu is shown, the active editor is `undefined`, but current might be the editor that was active before the menu popped up.
   */
  get currentEditor(): ServingUIWidget | undefined {
    return this._currentEditor;
  }
  protected setCurrentEditor(current: ServingUIWidget | undefined): void {
    if (this._currentEditor !== current) {
      this._currentEditor = current;
      this.onCurrentEditorChangedEmitter.fire(this._currentEditor);
    }
  }
  protected updateCurrentEditor(): void {
    const widget = this.shell.currentWidget;
    if (widget instanceof ServingUIWidget) {
      this.setCurrentEditor(widget);
    } else if (!this._currentEditor || !this._currentEditor.isVisible) {
      this.setCurrentEditor(this.recentlyVisible);
    }
  }

  canHandle(uri: URI, options?: WidgetOpenerOptions): number {
    if (uri.scheme.toLowerCase() === AppTemplateUris.TUNING_SCHEME) {
      return 10000;
    }

    return 0;
  }

  async open(
    uri: URI,
    options?: ServingOpenerOptions,
  ): Promise<ServingUIWidget> {
    console.log('opening tuning uri', uri, options);
    const editor = await super.open(uri, options);
    return editor;
  }
}
