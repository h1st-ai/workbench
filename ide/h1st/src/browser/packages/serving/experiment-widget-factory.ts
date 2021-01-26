import { MessageService, SelectionService } from '@theia/core';
import {
  LabelProvider,
  WidgetFactory,
  WidgetOpenerOptions,
} from '@theia/core/lib/browser';
import { ThemeService } from '@theia/core/lib/browser/theming';
import URI from '@theia/core/lib/common/uri';
import { TextEditorProvider } from '@theia/editor/lib/browser';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { injectable, inject } from 'inversify';
import { H1stBackendWithClientService } from '../../../common/protocol';
import { ServingUris } from './experiment-uris';
import { ServingUIWidget } from './serving-ui-widget';

export interface TuningExperimentWidgetOpenerOptions
  extends WidgetOpenerOptions {
  uri: string;
}

@injectable()
export class ServingUIWidgetFactory implements WidgetFactory {
  static ID = 'h1st-tuning-widget-opener';
  readonly id = ServingUIWidgetFactory.ID;

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
    options: TuningExperimentWidgetOpenerOptions,
  ): Promise<ServingUIWidget> {
    return this.createEditor(new URI(options.uri));
  }

  protected async createEditor(uri: URI): Promise<ServingUIWidget> {
    const data = ServingUris.decode(uri);

    const { name, id } = data;
    // const textEditor = await this.editorProvider(uri);
    const newExperiment = new ServingUIWidget(
      { name, id, uri },
      this.messageService,
    );

    // this.setLabels(newExperiment, uri);
    const labelListener = this.labelProvider.onDidChange(event => {
      if (event.affects(newExperiment)) {
        // this.setLabels(newExperiment, uri);
        alert('label');
      }
    });

    newExperiment.onDidDispose(() => labelListener.dispose());

    newExperiment.name = name;
    newExperiment.id = id;
    newExperiment.title.closable = true;

    this.setLabels(newExperiment);

    return newExperiment;
  }

  private setLabels(widget: ServingUIWidget): void {
    widget.title.caption = widget.name || widget.id;
    widget.title.label = widget.name;
    widget.title.iconClass = 'fa fa-cogs tuning-experiment';
  }
}
