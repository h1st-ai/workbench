import { EditorContribution } from "@theia/editor/lib/browser/editor-contribution";
import { ApplicationShell, OpenerService } from "@theia/core/lib/browser";
import { inject, injectable } from "inversify";
import URI from "@theia/core/lib/common/uri";

@injectable()
export class H1stNotebookEditorContribution extends EditorContribution {
  @inject(ApplicationShell) protected shell: ApplicationShell;
  @inject(OpenerService) protected opener: OpenerService;

  readonly id = "test_id";
  readonly label = "BaseTreeEditorWidget.WIDGET_LABEL";

  canHandle(uri: URI): number {
    console.log("can handle", uri.path.ext);
    if (uri.path.ext.toLowerCase() === ".ipynb") {
      return 10000;
    }
    return 0;
  }
}
