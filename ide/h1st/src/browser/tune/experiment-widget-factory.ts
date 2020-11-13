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
import { H1stBackendWithClientService } from '../../common/protocol';
import { TuningUris } from './experiment-uris';
import { ExperimentWidget } from './expriment-widget';

export interface TuningExperimentWidgetOpenerOptions
  extends WidgetOpenerOptions {
  uri: string;
}

@injectable()
export class ExperimentWidgetFactory implements WidgetFactory {
  static ID = 'h1st-tuning-widget-opener';
  readonly id = ExperimentWidgetFactory.ID;

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
  ): Promise<ExperimentWidget> {
    return this.createEditor(new URI(options.uri));
  }

  protected async createEditor(uri: URI): Promise<ExperimentWidget> {
    const data = TuningUris.decode(uri);

    const { name, id } = data;
    // const textEditor = await this.editorProvider(uri);
    const newExperiment = new ExperimentWidget({ name, id, uri });

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

  private setLabels(widget: ExperimentWidget): void {
    widget.title.caption = widget.name || widget.id;
    widget.title.label = widget.name;
    widget.title.iconClass = 'fa fa-cogs tuning-experiment';
  }
}
