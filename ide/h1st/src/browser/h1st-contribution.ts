import {
  CommandContribution,
  MenuContribution,
  CommandRegistry,
  MenuModelRegistry,
  Emitter,
  MessageService,
} from "@theia/core/lib/common";
import {
  LabelProvider,
  // CommonCommands,
  // FrontendApplication,
  // CommonCommands,
  open,
  CommonCommands,
  // CommonCommands,
  // FrontendApplicationContribution,
} from "@theia/core/lib/browser";

import { TaskCommands } from "@theia/task/lib/browser/task-frontend-contribution";
import { KeymapsCommands } from "@theia/keymaps/lib/browser/keymaps-frontend-contribution";
import {
  DebugCommands,
  DebugMenus,
} from "@theia/debug/lib/browser/debug-frontend-application-contribution";
// import { EditorManager } from "@theia/editr";
import { EditorManager } from "@theia/editor/lib/browser";
import URI from "@theia/core/lib/common/uri";
import { MaybePromise } from "@theia/core/lib/common/types";
// import { UriCommandHandler } from "@theia/core/lib/common/uri-command-handler";
import {
  CommonMenus,
  OpenerService,
  WidgetOpenHandler,
  WidgetOpenerOptions,
} from "@theia/core/lib/browser";

// import { FrontendApplication } from "@theia/core/lib/browser";

import { SelectionService } from "@theia/core/lib/common/selection-service";

import { FileSystemUtils } from "@theia/filesystem/lib/common";
import { FileStat } from "@theia/filesystem/lib/common/files";

import {
  NavigatorContextMenu,
  FileNavigatorContribution,
  // FileNavigatorCommands,
} from "@theia/navigator/lib/browser/navigator-contribution";

import { WorkspaceInputDialog } from "./components/workspace-input-dialog";

import { inject, injectable } from "inversify";
import { H1stBackendWithClientService } from "../common/protocol";

import {
  WorkspaceCommands,
  WorkspaceRootUriAwareCommandHandler,
  WorkspaceService,
} from "@theia/workspace/lib/browser";
import {
  H1stNewModelCommand,
  H1stNewNotebookCommand,
  H1stOpenWorkspace,
} from "./commands";
import { FileService } from "@theia/filesystem/lib/browser/file-service";

import getModelFileTemplate from "../common/templates/models";
// import getNotebookFileTemplate from "../common/templates/notebook";
import { UriCommandHandler } from "@theia/core/lib/common/uri-command-handler";
import { H1stAboutDialog } from "./style/about-dialog";

export interface DidCreateNewResourceEvent {
  uri: URI;
  parent: URI;
}

@injectable()
export class H1stWidgetHandler extends WidgetOpenHandler<any> {
  readonly id = "H1ST_WIDGET";

  constructor() {
    super();
  }

  canHandle(
    uri: URI,
    options?: WidgetOpenerOptions | undefined
  ): MaybePromise<number> {
    return Promise.resolve(1); // for now, handle everything
  }

  createWidgetOptions(
    uri: URI,
    options?: WidgetOpenerOptions | undefined
  ): Object {
    return {};
  }
}

@injectable()
export class H1stCommandContribution implements CommandContribution {
  @inject(MessageService) readonly messageService: MessageService;
  @inject(LabelProvider) protected readonly labelProvider: LabelProvider;
  @inject(OpenerService) protected readonly openerService: OpenerService;
  @inject(SelectionService)
  protected readonly selectionService: SelectionService;
  @inject(EditorManager) protected readonly editorManager: EditorManager;
  @inject(FileService) readonly fileService: FileService;

  @inject(FileNavigatorContribution)
  protected readonly fileNavigatorContribution: FileNavigatorContribution;

  @inject(WorkspaceService)
  protected readonly workspaceService: WorkspaceService;
  @inject(H1stAboutDialog)
  protected readonly aboutDialog: H1stAboutDialog;
  @inject(H1stBackendWithClientService)
  private readonly h1stBackEndWithClientService: H1stBackendWithClientService;

  private readonly onDidCreateNewModelEmitter = new Emitter<
    DidCreateNewResourceEvent
  >();

  protected newWorkspaceRootUriAwareCommandHandler(
    handler: UriCommandHandler<URI>
  ): WorkspaceRootUriAwareCommandHandler {
    return new WorkspaceRootUriAwareCommandHandler(
      this.workspaceService,
      this.selectionService,
      handler
    );
  }

  protected async getDirectory(candidate: URI): Promise<FileStat | undefined> {
    let stat: FileStat | undefined;
    try {
      stat = await this.fileService.resolve(candidate);
    } catch {}
    if (stat && stat.isDirectory) {
      return stat;
    }
    return this.getParent(candidate);
  }

  protected async getParent(candidate: URI): Promise<FileStat | undefined> {
    try {
      return await this.fileService.resolve(candidate.parent);
    } catch {
      return undefined;
    }
  }

  protected fireCreateNewModel(uri: DidCreateNewResourceEvent): void {
    this.onDidCreateNewModelEmitter.fire(uri);
  }

  registerCommands(registry: CommandRegistry): void {
    // Remove workspace actions
    try {
      registry.unregisterCommand(WorkspaceCommands.OPEN_WORKSPACE);
      registry.unregisterCommand(WorkspaceCommands.OPEN_RECENT_WORKSPACE);
      registry.unregisterCommand(WorkspaceCommands.SAVE_WORKSPACE_AS);
      registry.unregisterCommand(WorkspaceCommands.CLOSE);
      registry.unregisterCommand(WorkspaceCommands.OPEN);
      registry.unregisterCommand(WorkspaceCommands.ADD_FOLDER);
      registry.unregisterCommand({
        id: "navigator.tabbar.toolbar." + WorkspaceCommands.ADD_FOLDER,
      });
      registry.unregisterCommand(TaskCommands.TASK_RUN);
      registry.unregisterCommand(TaskCommands.TASK_ATTACH);
      registry.unregisterCommand(TaskCommands.TASK_RUN_LAST);
      registry.unregisterCommand(TaskCommands.TASK_RUN_BUILD);
      registry.unregisterCommand(TaskCommands.TASK_RUN_TEST);
      registry.unregisterCommand(TaskCommands.TASK_RUN_TEXT);
      registry.unregisterCommand(TaskCommands.TASK_SHOW_RUNNING);
      registry.unregisterCommand(TaskCommands.TASK_TERMINATE);
      registry.unregisterCommand(TaskCommands.TASK_RESTART_RUNNING);
      registry.unregisterCommand(TaskCommands.TASK_CONFIGURE);

      registry.unregisterCommand(KeymapsCommands.OPEN_KEYMAPS);
      registry.unregisterCommand(KeymapsCommands.OPEN_KEYMAPS_JSON);
      registry.unregisterCommand(KeymapsCommands.OPEN_KEYMAPS_JSON_TOOLBAR);
      registry.unregisterCommand(CommonCommands.ABOUT_COMMAND);

      const allDebugCommands: any = { ...DebugCommands };

      for (let key in DebugCommands) {
        registry.unregisterCommand(allDebugCommands[key]);
      }

      // console.log("Object.keys(DebugCommands)", Object.keys(DebugCommands));
      // const debugCommandKeys = Object.keys(DebugCommands);

      // debugCommandKeys.forEach((cmd) =>
      //   registry.unregisterCommand(DebugCommands[cmd])

      //   DebugCommands.
      // );

      // registry.unregisterCommand(CommonCommands.ABOUT_COMMAND);
      // registry.unregisterCommand(CommonCommands.SELECT_ICON_THEME);
    } catch (ex) {
      console.error(ex);
    }

    registry.registerCommand(CommonCommands.ABOUT_COMMAND, {
      execute: () => {
        this.aboutDialog.open();
      },
    });

    registry.registerCommand(H1stOpenWorkspace, {
      execute: async () => {
        //this.open(new URI("/"));
      },
    });

    registry.registerCommand(
      H1stNewModelCommand,
      this.newWorkspaceRootUriAwareCommandHandler({
        execute: (uri) =>
          this.getDirectory(uri).then((parent) => {
            if (parent) {
              const parentUri = parent.resource;
              const { fileName, fileExtension } = this.getDefaultFileConfig();
              const vacantChildUri = FileSystemUtils.generateUniqueResourceURI(
                parentUri,
                parent,
                fileName,
                fileExtension
              );

              const dialog = new WorkspaceInputDialog(
                {
                  title: "New H1st Model",
                  parentUri: parentUri,
                  initialValue: vacantChildUri.path.base,
                  validate: (name) =>
                    this.validateModelFileName(name, parent, true, "model"),
                },
                this.labelProvider
              );

              dialog.open().then(async (modelName) => {
                if (modelName) {
                  const name = `${modelName}.py`;

                  const workspaceName = await this.h1stBackEndWithClientService.getWorkspaceName();
                  const fileUri = parentUri.resolve(name);
                  // const modelName = name.split(".")[0];
                  await this.fileService.create(
                    fileUri,
                    getModelFileTemplate(workspaceName, modelName)
                  );
                  await this.fireCreateNewModel({
                    parent: parentUri,
                    uri: fileUri,
                  });
                  open(this.openerService, fileUri);
                }
              });
            }
          }),
      })
    );

    // registry.registerCommand(H1stNewModelCommand, {
    //   execute: () => {
    //     this.getRootDirectory().then(async (root) => {
    //       console.log("current root", root);
    //       this.fileNavigatorContribution.openView({ activate: true });

    //       const rootUri = new URI(root);
    //       let modelUri = rootUri.resolve("models");
    //       let notebookUri = rootUri.resolve("notebooks");
    //       const modelFileState = await this.fileService.resolve(modelUri);

    //       const { fileName, fileExtension } = this.getDefaultFileConfig();
    //       const vacantChildUri = FileSystemUtils.generateUniqueResourceURI(
    //         modelUri,
    //         modelFileState,
    //         fileName,
    //         fileExtension
    //       );

    //       const dialog = new WorkspaceInputDialog(
    //         {
    //           title: "New H1st Model",
    //           parentUri: modelUri,
    //           initialValue: vacantChildUri.path.base,
    //           validate: (name) =>
    //             this.validateModelFileName(name, modelFileState, true, "model"),
    //         },
    //         this.labelProvider
    //       );

    //       dialog.open().then(async (name) => {
    //         if (name) {
    //           const modelClassName = name.split(".")[0];

    //           await this.fileService.create(
    //             (modelUri = modelUri.resolve(name)),
    //             getModelFileTemplate(modelClassName)
    //           );

    //           const workspaceName = await this.h1stBackEndWithClientService.getWorkspaceName();

    //           try {
    //             await this.fileService.create(
    //               (notebookUri = notebookUri.resolve(
    //                 `${modelClassName}.ipynb`
    //               )),
    //               getNotebookFileTemplate(workspaceName, modelClassName)
    //             );
    //           } catch (error) {
    //             this.messageService.error(error);
    //           }

    //           this.fireCreateNewModel({
    //             parent: rootUri.resolve("/models"),
    //             uri: modelUri,
    //           });

    //           setTimeout(
    //             async () =>
    //               await this.editorManager.open(modelUri, {
    //                 mode: "reveal",
    //                 widgetOptions: { area: "bottom" },
    //               }),
    //             0
    //           );

    //           setTimeout(async () => {
    //             await this.editorManager.open(notebookUri, {
    //               mode: "activate",
    //               widgetOptions: { area: "main" },
    //             });

    //             this.app.shell.resize(
    //               global.window.innerHeight * 0.45,
    //               "bottom"
    //             );
    //           }, 100);
    //         }
    //       });
    //     });
    //   },
    // });
  }

  // private async getRootDirectory(): Promise<string> {
  //   return await this.h1stBackEndWithClientService.getWorkspacePath();
  // }

  // protected workspaceRootUriAwareCommandHandler(
  //   handler: UriCommandHandler<URI>
  // ): WorkspaceRootUriAwareCommandHandler {
  //   return new WorkspaceRootUriAwareCommandHandler(
  //     this.h1stfrontendApplicationContribution,
  //     this.selectionService,
  //     handler
  //   );
  // }

  // protected async getDirectory(candidate: URI): Promise<FileStat | undefined> {
  //   let stat: FileStat | undefined;
  //   try {
  //     stat = await this.h1stfrontendApplicationContribution.resolve(candidate);
  //   } catch {}
  //   if (stat && stat.isDirectory) {
  //     return stat;
  //   }
  //   return this.getParent(candidate);
  // }

  // protected async getParent(candidate: URI): Promise<FileStat | undefined> {
  //   try {
  //     return await this.fileService.resolve(candidate.parent);
  //   } catch {
  //     return undefined;
  //   }
  // }

  protected getDefaultFileConfig(): {
    fileName: string;
    fileExtension: string;
  } {
    return {
      fileName: "NewH1stModel",
      fileExtension: "",
    };
  }

  protected getDefaultNotebookFileConfig(): {
    fileName: string;
    fileExtension: string;
  } {
    return {
      fileName: "NewNotebook",
      fileExtension: ".ipynb",
    };
  }

  protected validateModelFileName(
    name: string,
    parent: FileStat,
    recursive: boolean = false,
    type: "model" | "notebook"
  ): string {
    if (!name) {
      return "";
    }

    if (type === "model") {
      if (!/^[a-zA-Z](\w){2,49}$/.test(name))
        return "Model name has to start with a letter, contains only letters and numbers and has to be betwen 3 to 50 characters in length";
    } else {
      if (!/^[a-zA-Z].[\w_\\-]+\.ipynb$/.test(name))
        return "Invalid name. Notebook name can only include characters and numbers";
    }

    return "";
  }
}

// @injectable()
// export class H1stFileNavigatorContribution implements FileNavigatorContribution {

// }

@injectable()
export class H1stMenuContribution implements MenuContribution {
  registerMenus(menus: MenuModelRegistry): void {
    try {
      menus.unregisterMenuAction(WorkspaceCommands.OPEN_WORKSPACE.id);
      menus.unregisterMenuAction(WorkspaceCommands.OPEN_RECENT_WORKSPACE.id);
      menus.unregisterMenuAction(WorkspaceCommands.SAVE_WORKSPACE_AS.id);
      menus.unregisterMenuAction(WorkspaceCommands.CLOSE.id);
      menus.unregisterMenuAction(WorkspaceCommands.OPEN.id);
      menus.unregisterMenuAction(WorkspaceCommands.ADD_FOLDER.id);
      // menus.unregisterMenuAction(CommonCommands.ABOUT_COMMAND.id);
      // menus.unregisterMenuAction(CommonCommands.ABOUT_COMMAND.id);
      menus.unregisterMenuAction(DebugMenus.DEBUG.slice(-1)[0]);
      menus.unregisterMenuAction(CommonMenus.VIEW.slice(-1)[0]);
      menus.unregisterMenuAction(CommonMenus.HELP.slice(-1)[0]);
    } catch (error) {
      console.log(error);
    }

    menus.registerMenuAction(CommonMenus.FILE_NEW, {
      commandId: H1stNewModelCommand.id,
      label: H1stNewModelCommand.label,
    });

    menus.registerMenuAction(NavigatorContextMenu.NEW, {
      commandId: H1stNewModelCommand.id,
      label: H1stNewModelCommand.label,
    });

    menus.registerMenuAction(CommonMenus.FILE_NEW, {
      commandId: H1stNewNotebookCommand.id,
      label: H1stNewNotebookCommand.label,
    });

    menus.registerMenuAction(NavigatorContextMenu.NEW, {
      commandId: H1stNewNotebookCommand.id,
      label: H1stNewNotebookCommand.label,
    });
  }
}
