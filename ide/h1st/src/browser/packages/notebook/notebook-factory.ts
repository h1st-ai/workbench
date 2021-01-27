import { MessageService, SelectionService } from '@theia/core';
import {
  LabelProvider,
  NavigatableWidgetOptions,
  WidgetFactory,
} from '@theia/core/lib/browser';
import { ThemeService } from '@theia/core/lib/browser/theming';
import URI from '@theia/core/lib/common/uri';
import { TextEditorProvider } from '@theia/editor/lib/browser';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { injectable, inject } from 'inversify';
import { H1stBackendWithClientService } from '../../../common/protocol';
import { DEFAULT_CELL } from './defaults';
import { H1stNotebookWidget } from './notebook-widget';
import { ICellModel } from './types';

const uniqid = require('uniqid');

@injectable()
export class NotebookFactory implements WidgetFactory {
  static ID = 'h1st-notebook-opener';
  readonly id = NotebookFactory.ID;

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

  static makeNewCell(): ICellModel {
    // @ts-ignore
    return {
      ...DEFAULT_CELL,
      id: uniqid(),
    };
  }

  createWidget(options: NavigatableWidgetOptions): Promise<H1stNotebookWidget> {
    const uri = new URI(options.uri);
    return this.createEditor(uri);
  }

  protected async createEditor(uri: URI): Promise<H1stNotebookWidget> {
    console.log('services', this.h1stBackendWithClientService);
    const newNotebook = new H1stNotebookWidget(
      uri,
      this.selectionService,
      this.fileService,
      this.themeService,
      this.messageService,
      this.h1stBackendWithClientService,
    );

    this.setLabels(newNotebook, uri);
    // const labelListener = this.labelProvider.onDidChange((event) => {
    //   if (event.affects(uri)) {
    //     this.setLabels(newNotebook, uri);
    //   }
    // });
    // newNotebook.onDispose(() => labelListener.dispose());

    newNotebook.id = this.id + ':' + uri.toString();
    newNotebook.title.closable = true;
    return newNotebook;
  }

  private setLabels(widget: H1stNotebookWidget, uri: URI): void {
    widget.title.caption = this.labelProvider.getLongName(uri);
    const icon = this.labelProvider.getIcon(uri);
    widget.title.label = this.labelProvider.getName(uri);
    widget.title.iconClass = icon + ' file-icon';
  }
}
