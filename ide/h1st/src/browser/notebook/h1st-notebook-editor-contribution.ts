import { EditorContribution } from "@theia/editor/lib/browser/editor-contribution";
import {
  ApplicationShell,
  NavigatableWidgetOptions,
  OpenerService,
  // WidgetFactory,
  WidgetManager,
} from "@theia/core/lib/browser";
import { inject, injectable } from "inversify";
import URI from "@theia/core/lib/common/uri";
import { H1stNotebookWidget } from "./h1st-notebook-widget";
import { H1stNotebookWidgetFactory } from "./h1st-notebook-widget-factory";

@injectable()
export class H1stNotebookEditorContribution extends EditorContribution {
  @inject(ApplicationShell) protected shell: ApplicationShell;
  @inject(OpenerService) protected opener: OpenerService;
  @inject(H1stNotebookWidgetFactory)
  protected notebookWidgetFactory: H1stNotebookWidgetFactory;
  @inject(WidgetManager) protected widgetManager: WidgetManager;

  readonly id = "test_id";
  readonly label = "BaseTreeEditorWidget.WIDGET_LABEL";

  canHandle(uri: URI): number {
    console.log("can handle", uri.path.ext);
    if (uri.path.ext.toLowerCase() === ".ipynb") {
      return 10000;
    }
    return 0;
  }

  // open(uri: URI) {
  //   console.log("openning", uri.toString());
  // }
  async open(
    uri: URI,
    options?: NavigatableWidgetOptions
  ): Promise<H1stNotebookWidget> {
    console.log("openning", uri.toString());

    // const editor: H1stNotebookWidget = await this.widgetManager.getOrCreateWidget(
    //   H1stNotebookWidgetFactory.ID
    // );
    let editor = await this.widgetManager.getWidget(
      H1stNotebookWidgetFactory.ID
    );

    if (!editor) {
      editor = await this.notebookWidgetFactory.createWidget({
        kind: "navigatable",
        uri: uri.toString(),
      });
    }
    this.shell.addWidget(editor);
    editor.activate();

    // const
    // console.log(editor);

    // this.shell.activateWidget(editor.id);

    return editor;
  }
}
