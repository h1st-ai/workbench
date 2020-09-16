import { SelectionService } from "@theia/core";
import {
  LabelProvider,
  NavigatableWidgetOptions,
  WidgetFactory,
} from "@theia/core/lib/browser";
import URI from "@theia/core/lib/common/uri";
import { TextEditorProvider } from "@theia/editor/lib/browser";
import { injectable, inject } from "inversify";
import { H1stNotebookWidget } from "./h1st-notebook-widget";

@injectable()
export class H1stNotebookWidgetFactory implements WidgetFactory {
  static ID = "h1st-notebook-opener";
  readonly id = H1stNotebookWidgetFactory.ID;

  @inject(LabelProvider) protected readonly labelProvider: LabelProvider;
  @inject(TextEditorProvider)
  protected readonly editorProvider: TextEditorProvider;
  @inject(SelectionService)
  protected readonly selectionService: SelectionService;

  createWidget(options: NavigatableWidgetOptions): Promise<H1stNotebookWidget> {
    const uri = new URI(options.uri);
    return this.createEditor(uri);
  }

  protected async createEditor(uri: URI): Promise<H1stNotebookWidget> {
    // const textEditor = await this.editorProvider(uri);
    const newNotebook = new H1stNotebookWidget(uri, this.selectionService);

    this.setLabels(newNotebook, uri);
    // const labelListener = this.labelProvider.onDidChange((event) => {
    //   if (event.affects(uri)) {
    //     this.setLabels(newNotebook, uri);
    //   }
    // });
    // newNotebook.onDispose(() => labelListener.dispose());

    newNotebook.id = this.id + ":" + uri.toString();
    newNotebook.title.closable = true;
    return newNotebook;
  }

  private setLabels(widget: H1stNotebookWidget, uri: URI): void {
    widget.title.caption = this.labelProvider.getLongName(uri);
    const icon = this.labelProvider.getIcon(uri);
    widget.title.label = this.labelProvider.getName(uri);
    widget.title.iconClass = icon + " file-icon";
  }
}
