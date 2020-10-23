import { FileNavigatorContribution } from "@theia/navigator/lib/browser/navigator-contribution";
import { inject, injectable } from "inversify";
import {
  FrontendApplicationContribution,
  FrontendApplication,
  open,
  OpenerService,
} from "@theia/core/lib/browser";
import { MonacoEditor } from '@theia/monaco/lib/browser/monaco-editor';
import { H1stBackendWithClientService } from "../common/protocol";
import { FrontendApplicationStateService } from "@theia/core/lib/browser/frontend-application-state";
import { WorkspaceService } from "@theia/workspace/lib/browser";
import { PreviewUri } from "@theia/preview/lib/browser/preview-uri";
import { TerminalService } from "@theia/terminal/lib/browser/base/terminal-service";
import URI from "@theia/core/lib/common/uri";
import { EditorManager, EditorWidget } from "@theia/editor/lib/browser";
import { H1stHeaderWidget } from "./widgets/h1st-header-widget";
import { FileService } from "@theia/filesystem/lib/browser/file-service";

@injectable()
export class H1stFrontendApplicationContribution
  implements FrontendApplicationContribution {
  @inject(H1stBackendWithClientService)
  private h1stBackEndWithClientService: H1stBackendWithClientService;
  @inject(FileNavigatorContribution)
  protected  fileNavigatorContribution: FileNavigatorContribution;
  @inject(EditorManager) protected editorManager: EditorManager;
  @inject(FrontendApplicationStateService)
  protected frontendApplicationStateService: FrontendApplicationStateService;
  @inject(WorkspaceService) protected workspaceService: WorkspaceService;
  @inject(TerminalService) protected terminalService: TerminalService;
  @inject(FileService) protected fileService: FileService;
  @inject(OpenerService) protected openerService: OpenerService;
  @inject(H1stHeaderWidget) protected headerWidget: H1stHeaderWidget;

  // happen onces, when there is not saved workspace
  async initializeLayout(app: FrontendApplication) {
    if (this.workspaceService.opened) {
      this.frontendApplicationStateService
        .reachedState("ready")
        .then(async () => {
          const rootPath = await this.h1stBackEndWithClientService.getWorkspacePath();
          const root = new URI(rootPath);

          let mainModel;
          let mainNotebook;

          const models = await this.fileService.resolve(root, {
            resolveMetadata: true,
          });

          if (models.children) {
            try {
              for (let i = 0; i < models.children.length; i++) {
                const child = models.children[i];
                if (child.isFile && /\w+(_model\.py)$/.test(child.name)) {
                  mainModel = child.resource;
                } else if (
                  child.isFile &&
                  /\w+(_modeling\.py)$/.test(child.name)
                ) {
                  mainNotebook = child.resource;
                }
              }
            } catch (error) {
              console.log(error);
              //do nothing
            }
          }

          console.log("openning default layout", mainModel, mainNotebook);

          if (mainModel) {
            try {
              await this.editorManager.open(mainModel, {
                mode: "reveal",
                widgetOptions: { area: "main" },
              });
            } catch (ex) {
              // do nothing
              console.log(ex);
            }
          }

          if (mainNotebook) {
            try {
              await this.editorManager.open(mainNotebook, {
                mode: "activate",
                widgetOptions: { area: "main" },
              });
            } catch (ex) {
              // do nothing
              console.log(ex);
            }
          }

          await this.fileNavigatorContribution.openView({ reveal: true });
          const terminalWidget = await this.terminalService.newTerminal({
            cwd: rootPath,
          });
          await terminalWidget.start();
          this.terminalService.activateTerminal(terminalWidget);
        });
    }
  }

  onStart(app: FrontendApplication): void {
    app.shell.onDidAddWidget(widget => {
      console.log("widget", widget)
      if (widget instanceof EditorWidget) {
        const { editor } = widget;

        if (editor instanceof MonacoEditor) {
          const uri = editor.getResourceUri();
          console.log("widget1", uri && uri.scheme === 'file' && uri.path.ext === '.md')
          if (uri && uri.scheme === 'file' && uri.path.ext === '.md') {
            open(this.openerService, PreviewUri.encode(uri), { preview: true, mode: 'reveal', widgetOptions: { mode: 'split-right' } })
            }
        }
      }
    });
}
}
