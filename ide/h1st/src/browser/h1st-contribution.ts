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
  open,
  CommonCommands,
  FrontendApplication,
} from "@theia/core/lib/browser";

import { TaskCommands } from "@theia/task/lib/browser/task-frontend-contribution";
import { KeymapsCommands } from "@theia/keymaps/lib/browser/keymaps-frontend-contribution";
import {
  DebugCommands,
  DebugMenus,
} from "@theia/debug/lib/browser/debug-frontend-application-contribution";
import { EditorManager } from "@theia/editor/lib/browser";
import URI from "@theia/core/lib/common/uri";
import { CommonMenus, OpenerService } from "@theia/core/lib/browser";
import { SelectionService } from "@theia/core/lib/common/selection-service";
import { FileSystemUtils } from "@theia/filesystem/lib/common";
import { FileStat } from "@theia/filesystem/lib/common/files";

import {
  NavigatorContextMenu,
  FileNavigatorContribution,
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
import {
  H1stNotebookWidget,
  NotebookCommand,
  NotebookMenu,
} from "./notebook/h1st-notebook-widget";

export interface DidCreateNewResourceEvent {
  uri: URI;
  parent: URI;
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
  @inject(FrontendApplication) private readonly app: FrontendApplication;

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

    // notebook command
    registry.registerCommand(NotebookCommand.RestartKernelAndRunAll, {
      isEnabled: () => {
        const widget = this.app.shell.activeWidget;

        return widget instanceof H1stNotebookWidget;
      },
      execute: () => {
        console.log(
          "this.app.shell.activeWidget",
          this.app.shell.activeWidget instanceof H1stNotebookWidget
        );
        const widget: H1stNotebookWidget | undefined = this.app.shell
          .activeWidget as H1stNotebookWidget;

        if (widget) {
          const manager = widget.manager;

          manager.test();
        }
      },
    });

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
  }

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
      console.log("error", error);
    }

    menus.registerSubmenu(NotebookMenu.NOTEBOOK, "Notebook");
    menus.registerSubmenu(NotebookMenu.NOTEBOOK_KERNEL_SUBMENU, "Kernel");

    menus.registerMenuAction(NotebookMenu.NOTEBOOK, {
      commandId: NotebookCommand.RestartKernelAndRunAll.id,
      label: NotebookCommand.RestartKernelAndRunAll.label,
      order: "11",
    });

    menus.registerMenuAction(NotebookMenu.FILE_SETTINGS_SUBMENU_OPEN, {
      commandId: NotebookCommand.RestartKernelAndRunAll.id,
      label: NotebookCommand.RestartKernelAndRunAll.label,
      order: "111",
    });

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
