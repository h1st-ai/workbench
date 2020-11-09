import { MessageService, SelectionService } from "@theia/core";
import {
  LabelProvider,
  WidgetFactory,
  WidgetOpenerOptions,
} from "@theia/core/lib/browser";
import { ThemeService } from "@theia/core/lib/browser/theming";
import { TextEditorProvider } from "@theia/editor/lib/browser";
import { FileService } from "@theia/filesystem/lib/browser/file-service";
import { injectable, inject } from "inversify";
import { H1stBackendWithClientService } from "../../common/protocol";
import { ExperimentWidget } from "./expriment-widget";

const uniqid = require("uniqid");

export interface TuningExperimentWidgetOpenerOptions
  extends WidgetOpenerOptions {
  name: string;
}

@injectable()
export class ExperimentWidgetFactory implements WidgetFactory {
  static ID = "h1st-tuning-widget-opener";
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
    options: TuningExperimentWidgetOpenerOptions
  ): Promise<ExperimentWidget> {
    return this.createEditor(options.name);
  }

  protected async createEditor(name: string): Promise<ExperimentWidget> {
    // const textEditor = await this.editorProvider(uri);
    const newExperiment = new ExperimentWidget(name);

    // this.setLabels(newExperiment, uri);
    const labelListener = this.labelProvider.onDidChange((event) => {
      if (event.affects(newExperiment)) {
        // this.setLabels(newExperiment, uri);
        alert("label");
      }
    });

    newExperiment.onDidDispose(() => labelListener.dispose());

    newExperiment.id = uniqid("tunning");
    newExperiment.title.closable = true;

    this.setLabels(newExperiment);

    return newExperiment;
  }

  private setLabels(widget: ExperimentWidget): void {
    widget.title.caption = widget.name || widget.id;
    widget.title.label = widget.name;
    widget.title.iconClass = "tuning-experiment";
  }
}
