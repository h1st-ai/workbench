import { MessageService, SelectionService } from "@theia/core";
import {
  LabelProvider,
  NavigatableWidgetOptions,
  WidgetFactory,
} from "@theia/core/lib/browser";
import { ThemeService } from "@theia/core/lib/browser/theming";
import URI from "@theia/core/lib/common/uri";
import { TextEditorProvider } from "@theia/editor/lib/browser";
import { FileService } from "@theia/filesystem/lib/browser/file-service";
import { injectable, inject } from "inversify";
import { H1stBackendWithClientService } from "../../common/protocol";
import { H1stGraphWidget } from "./graph-widget";

const uniqid = require("uniqid");

@injectable()
export class GraphFactory implements WidgetFactory {
  static ID = "h1st-graph-opener";
  readonly id = GraphFactory.ID;

  @inject(LabelProvider) protected readonly labelProvider: LabelProvider;
  @inject(TextEditorProvider)
  protected readonly editorProvider: TextEditorProvider;
  @inject(SelectionService)
  protected readonly selectionService: SelectionService;
  @inject(FileService)
  protected readonly fileService: FileService;
  @inject(ThemeService) protected readonly themeService: ThemeService;
  @inject(MessageService) protected readonly messageService: MessageService;
  @inject(H1stBackendWithClientService)
  protected readonly h1stBackendWithClientService: H1stBackendWithClientService;

  createWidget(options: NavigatableWidgetOptions): Promise<H1stGraphWidget> {
    const uri = new URI(options.uri);
    return this.createEditor(uri);
  }

  protected async createEditor(uri: URI): Promise<H1stGraphWidget> {
    // const textEditor = await this.editorProvider(uri);
    const newVisualization = new H1stGraphWidget(uri);

    this.setLabels(newVisualization, uri);

    newVisualization.id = this.id + ":" + uri.toString();
    newVisualization.title.closable = true;
    return newVisualization;
  }

  private setLabels(widget: H1stGraphWidget, uri: URI): void {
    widget.title.caption = this.labelProvider.getLongName(uri);
    const icon = this.labelProvider.getIcon(uri);
    widget.title.label = this.labelProvider.getName(uri);
    widget.title.iconClass = icon + " file-icon";
  }
}
