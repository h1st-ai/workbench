// import { H1stBackendWithClientService } from "../common/protocol";
import { FileNavigatorContribution } from "@theia/navigator/lib/browser/navigator-contribution";
import { inject, injectable } from "inversify";
import {
  // FrontendApplication,
  FrontendApplicationContribution,
  FrontendApplication,
  // FrontendApplicationContribution,
} from "@theia/core/lib/browser";
// import { MaybePromise } from "@theia/core";
// import { WorkspaceService } from "@theia/workspace/lib/browser";
import { H1stBackendWithClientService } from "../common/protocol";
import { FrontendApplicationStateService } from "@theia/core/lib/browser/frontend-application-state";
import { WorkspaceService } from "@theia/workspace/lib/browser";
// import { FileService } from "@theia/filesystem/lib/browser/file-service";
import { TerminalService } from "@theia/terminal/lib/browser/base/terminal-service";
import URI from "@theia/core/lib/common/uri";
// import { FileStat } from "@theia/filesystem/lib/common";
import { EditorManager } from "@theia/editor/lib/browser";
import { H1stHeaderWidget } from "./widgets/h1st-header-widget";
import { FileService } from "@theia/filesystem/lib/browser/file-service";

// import URI from "@theia/core/lib/common/uri";
// import { WorkspaceFrontendContribution } from "@theia/workspace/lib/browser";
// import { MaybePromise } from "@theia/core";

@injectable()
export class H1stFrontendApplicationContribution
  implements FrontendApplicationContribution {
  @inject(H1stBackendWithClientService)
  private readonly h1stBackEndWithClientService: H1stBackendWithClientService;
  @inject(FileNavigatorContribution)
  protected readonly fileNavigatorContribution: FileNavigatorContribution;
  // @inject(FileService) private readonly fileService: FileService;
  @inject(EditorManager) protected readonly editorManager: EditorManager;
  @inject(FrontendApplicationStateService)
  frontendApplicationStateService: FrontendApplicationStateService;
  @inject(WorkspaceService) workspaceService: WorkspaceService;
  @inject(TerminalService) terminalService: TerminalService;
  @inject(FileService) fileService: FileService;
  @inject(H1stHeaderWidget) headerWidget: H1stHeaderWidget;

  protected REFRESH_ID: NodeJS.Timeout;

  // happen onces, when there is not saved workspace
  async initializeLayout(app: FrontendApplication) {
    if (this.workspaceService.opened) {
      this.frontendApplicationStateService
        .reachedState("ready")
        .then(async () => {
          const rootPath = await this.h1stBackEndWithClientService.getWorkspacePath();
          // const moduleName = await this.h1stBackEndWithClientService.getWorkspaceName();
          const root = new URI(rootPath);
          // const filePrefix = moduleName.toLowerCase().replace(/ /g, "");
          // const mainModel = root.resolve(`${filePrefix}_model.py`);
          // const mainNotebook = root.resolve(`${filePrefix}_modeling.py`);

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

          // const modelUri = root.resolve("models");
          // const models = await this.fileService.resolve(modelUri, {
          //   resolveMetadata: true,
          // });
          // const notebookUri = root.resolve("notebooks");
          // const notebooks = await this.fileService.resolve(notebookUri, {
          //   resolveMetadata: true,
          // });

          // const testModel = root.resolve("tests/test_model.py");

          // // open a model by default
          // if (models.children) {
          //   try {
          //     for (let i = 0; i < models.children.length; i++) {
          //       const child = models.children[i];
          //       if (
          //         child.isFile &&
          //         child.name.substr(-3, 3) === ".py" &&
          //         child.name.substr(0, 2) !== "__"
          //       ) {
          //         this.editorManager.open(child.resource, {
          //           mode: "reveal",
          //           widgetOptions: { area: "main" },
          //         });

          //         break;
          //       }
          //     }
          //   } catch (error) {
          //     //do nothing
          //   }
          // }

          // open a notebook by default
          // if (notebooks.children) {
          //   try {
          //     for (let i = 0; i < notebooks.children.length; i++) {
          //       const child = notebooks.children[i];

          //       if (child.isFile && child.name.substr(-6, 6) === ".ipynb") {
          //         setTimeout(async () => {
          //           await this.editorManager.open(child.resource, {
          //             mode: "reveal",
          //             widgetOptions: { area: "main", mode: "split-top" },
          //           });
          //         }, 400);
          //         break;
          //       }
          //     }
          //   } catch (ex) {
          //     // do nothing
          //   }
          // }

          await this.fileNavigatorContribution.openView({ reveal: true });
          const terminalWidget = await this.terminalService.newTerminal({
            cwd: rootPath,
          });
          await terminalWidget.start();
          await this.terminalService.activateTerminal(terminalWidget);
        });
    }
  }

  // onDidInitializeLayout() {}

  // initialize() {
  //   this.frontendApplicationStateService
  //     .reachedState("ready")
  //     .then(async () => {
  //       this.headerWidget.
  //     });
  // }

  // onWillStop(app: FrontendApplication): boolean | void {
  //   clearInterval(this.REFRESH_ID);
  // }
}
