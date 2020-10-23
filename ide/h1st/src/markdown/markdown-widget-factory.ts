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
import { H1stBackendWithClientService } from "../common/protocol";
import { MardownEditorWidget } from "./index";

@injectable()
export class MarkdownWidgetFactory implements WidgetFactory {
  static ID = "h1st-markdown-widget";
  readonly id = MarkdownWidgetFactory.ID;

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

  createWidget(
    options: NavigatableWidgetOptions
  ): Promise<MardownEditorWidget> {
    const uri = new URI(options.uri);
    return this.createEditor(uri);
  }

  protected async createEditor(uri: URI): Promise<MardownEditorWidget> {
    // const textEditor = await this.editorProvider(uri);
    const newNotebook = new MardownEditorWidget(
      uri,
      this.selectionService,
      this.fileService,
      this.themeService,
      this.messageService,
      this.h1stBackendWithClientService
    );

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

  private setLabels(widget: MardownEditorWidget, uri: URI): void {
    widget.title.caption = this.labelProvider.getLongName(uri);
    const icon = this.labelProvider.getIcon(uri);
    widget.title.label = this.labelProvider.getName(uri);
    widget.title.iconClass = icon + " file-icon";
  }
}
