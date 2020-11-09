import { injectable, inject } from "inversify";
import { ExperimentWidget } from "./index";
import {
  AbstractViewContribution,
  FrontendApplicationContribution,
  FrontendApplication,
  Widget,
} from "@theia/core/lib/browser";
import { Command, CommandRegistry } from "@theia/core/lib/common/command";
import { FrontendApplicationStateService } from "@theia/core/lib/browser/frontend-application-state";
import {
  TabBarToolbarContribution,
  TabBarToolbarRegistry,
} from "@theia/core/lib/browser/shell/tab-bar-toolbar";
import { MAIN_MENU_BAR, MenuModelRegistry } from "@theia/core";

namespace TunningCommands {
  const TUNE_CATEGORY = "Hyper Parameter Tuning";

  export const REFRESH: Command = {
    id: "h1st:tuning:experiment:refresh",
    label: "Refresh",
    category: TUNE_CATEGORY,
    iconClass: "refresh",
  };

  export const NEW_EXPERIMENT: Command = {
    id: "h1st:tuning:experiment:new_experiment",
    label: "New Experiment",
    category: TUNE_CATEGORY,
    iconClass: "add",
  };

  export const TUNING_EXPERIMENT_COMMAND: Command = {
    id: "h1st:tuning:widget:experiment",
    label: "Open Experiment",
  };
}

export const TOOL_MENU = [...MAIN_MENU_BAR, "5_tools"];

export namespace TuningMenu {
  export const TUNING = [...TOOL_MENU, "1_turning_submenu"];
  export const TUNING_EXP_LIST = [...TUNING, "1_turning_submenu_explist"];
  // export const FILE_SETTINGS_SUBMENU_OPEN = [
  //   ...NOTEBOOK_KERNEL_SUBMENU,
  //   "1_notebook_submenu_kernel",
  // ];
}

@injectable()
export class TuningContribution
  extends AbstractViewContribution<ExperimentWidget>
  implements FrontendApplicationContribution, TabBarToolbarContribution {
  @inject(FrontendApplicationStateService)
  protected readonly stateService: FrontendApplicationStateService;
  /**
   * `AbstractViewContribution` handles the creation and registering
   *  of the widget including commands, menus, and keybindings.
   *
   * We can pass `defaultWidgetOptions` which define widget properties such as
   * its location `area` (`main`, `left`, `right`, `bottom`), `mode`, and `ref`.
   *
   */
  constructor() {
    super({
      widgetId: ExperimentWidget.ID,
      widgetName: ExperimentWidget.LABEL,
      defaultWidgetOptions: { area: "left", rank: 200 },
      toggleCommandId: TunningCommands.TUNING_EXPERIMENT_COMMAND.id,
    });
  }

  async onStart(app: FrontendApplication): Promise<void> {
    // alert("on start");
  }

  registerCommands(commands: CommandRegistry): void {
    super.registerCommands(commands);
    commands.registerCommand(TunningCommands.REFRESH, {
      isEnabled: (widget) => this.withWidget(widget, () => true),
      isVisible: (widget) => this.withWidget(widget, () => true),
      execute: () => alert("test"),
    });

    commands.registerCommand(TunningCommands.NEW_EXPERIMENT, {
      isEnabled: (widget) => this.withWidget(widget, () => true),
      isVisible: (widget) => this.withWidget(widget, () => true),
      execute: () => alert("new experiment"),
    });
  }

  async registerToolbarItems(toolbar: TabBarToolbarRegistry): Promise<void> {
    const widget = await this.widget;
    const onDidChange = widget.onDidUpdate;
    toolbar.registerItem({
      id: TunningCommands.REFRESH.id,
      command: TunningCommands.REFRESH.id,
      tooltip: TunningCommands.REFRESH.label,
      priority: 2,
      onDidChange,
    });

    toolbar.registerItem({
      id: TunningCommands.NEW_EXPERIMENT.id,
      command: TunningCommands.NEW_EXPERIMENT.id,
      tooltip: TunningCommands.NEW_EXPERIMENT.label,
      priority: 1,
      onDidChange,
    });
  }

  registerMenus(menus: MenuModelRegistry): void {
    menus.registerSubmenu(TOOL_MENU, "Tools");
    menus.registerSubmenu(TuningMenu.TUNING, "Hyper Params Tuning");
    // menus.registerSubmenu(TuningMenu.TUNING_EXP_LIST, "View Experiments");

    // menus.registerMenuAction(TuningMenu.TUNING, {
    //   commandId: NotebookCommand.RestartKernelAndRunAll.id,
    //   label: NotebookCommand.RestartKernelAndRunAll.label,
    //   order: "11",
    // });

    menus.registerMenuAction(TuningMenu.TUNING_EXP_LIST, {
      commandId: TunningCommands.TUNING_EXPERIMENT_COMMAND.id,
      label: TunningCommands.TUNING_EXPERIMENT_COMMAND.label,
      order: "111",
    });
  }

  async initializeLayout(): Promise<void> {
    await this.openView();
  }

  protected withWidget<T>(
    widget: Widget | undefined = this.tryGetWidget(),
    fn: (widget: ExperimentWidget) => T
  ): T | false {
    if (
      widget instanceof ExperimentWidget &&
      widget.id === ExperimentWidget.ID
    ) {
      return fn(widget);
    }
    return false;
  }

  /**
     * Example command registration to open the widget from the menu, and quick-open.
     * For a simpler use case, it is possible to simply call:
     ```ts
        super.registerCommands(commands)
     ```
     *
     * For more flexibility, we can pass `OpenViewArguments` which define 
     * options on how to handle opening the widget:
     * 
     ```ts
        toggle?: boolean
        activate?: boolean;
        reveal?: boolean;
     ```
     *
     * @param commands
     */
  // registerCommands(commands: CommandRegistry): void {
  //   commands.registerCommand(H1stHeaderCommand, {
  //     execute: () => super.openView({ activate: false, reveal: true }),
  //   });
  // }

  /**
     * Example menu registration to contribute a menu item used to open the widget.
     * Default location when extending the `AbstractViewContribution` is the `View` main-menu item.
     * 
     * We can however define new menu path locations in the following way:
     ```ts
        menus.registerMenuAction(CommonMenus.HELP, {
            commandId: 'id',
            label: 'label'
        });
     ```
     * 
     * @param menus
     */
}
