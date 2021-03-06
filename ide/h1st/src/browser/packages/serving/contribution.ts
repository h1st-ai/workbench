import { injectable, inject } from 'inversify';
import { ServingPanelWidget } from './index';
import {
  AbstractViewContribution,
  FrontendApplicationContribution,
  FrontendApplication,
  Widget,
} from '@theia/core/lib/browser';
import { Command, CommandRegistry } from '@theia/core/lib/common/command';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';
import {
  TabBarToolbarContribution,
  TabBarToolbarRegistry,
} from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { OpenerService, open } from '@theia/core/lib/browser/opener-service';
import { MenuModelRegistry } from '@theia/core';
import { TOOL_MENU } from '../tune/contribution';
import { ServingUris } from './experiment-uris';

export namespace ServingCommands {
  const SERVING_CATEGORY = 'Serving';

  export const SERVING: Command = {
    id: 'h1st:serving:open',
    label: 'Serving Panel',
    category: SERVING_CATEGORY,
    // iconClass: 'add',
  };

  export const NEW_SERVING_PANEL: Command = {
    id: 'h1st:serving:new',
    label: 'New Serving Panel',
    category: SERVING_CATEGORY,
    // iconClass: 'add',
  };

  export const SERVING_COMMAND: Command = {
    id: 'h1st:serving:open-panel',
    label: 'Open Serving',
  };
}

export namespace ServingMenu {
  export const SERVING = [...TOOL_MENU, '2_serving_submenu'];
}

@injectable()
export class ServingContribution
  extends AbstractViewContribution<ServingPanelWidget>
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
  constructor(@inject(OpenerService) protected openerService: OpenerService) {
    super({
      widgetId: ServingPanelWidget.ID,
      widgetName: ServingPanelWidget.LABEL,
      defaultWidgetOptions: { area: 'left', rank: 200 },
      toggleCommandId: ServingCommands.SERVING_COMMAND.id,
    });
  }

  async onStart(app: FrontendApplication): Promise<void> {
    // alert("on start");
  }

  registerCommands(commands: CommandRegistry): void {
    super.registerCommands(commands);

    commands.registerCommand(ServingCommands.SERVING, {
      isEnabled: widget => this.withWidget(widget, () => true),
      isVisible: widget => this.withWidget(widget, () => true),
      execute: () => {
        // console.log(JSON.stringify(arguments));
        console.log('inside handler');

        const name = `Serving`;

        open(this.openerService, ServingUris.encode('serving-view', name), {
          mode: 'activate',
          name,
          id: 'serving-view',
        });

        this.toggleView();

        // console.log('On execute with widget');
        // console.log('after widget');
        // manager.createNewExperiment();
        // manager.a();
        // console.log(widget);
      },
      // this.withWidget(widget, () => {
      //   console.log('hgaha', widget);
      //   (widget as ServingPanelWidget).manager.createNewExperiment();
      // }),
    });
  }

  async registerToolbarItems(toolbar: TabBarToolbarRegistry): Promise<void> {
    const widget = await this.widget;
    const onDidChange = widget.onDidUpdate;
    // toolbar.registerItem({
    //   id: ServingCommands.REFRESH.id,
    //   command: ServingCommands.REFRESH.id,
    //   tooltip: ServingCommands.REFRESH.label,
    //   priority: 2,
    //   onDidChange,
    // });

    toolbar.registerItem({
      id: ServingCommands.NEW_SERVING_PANEL.id,
      command: ServingCommands.NEW_SERVING_PANEL.id,
      tooltip: ServingCommands.NEW_SERVING_PANEL.label,
      priority: 1,
      onDidChange,
    });
  }

  registerMenus(menus: MenuModelRegistry): void {
    menus.registerSubmenu(ServingMenu.SERVING, 'Serving');

    menus.registerMenuAction(ServingMenu.SERVING, {
      commandId: ServingCommands.SERVING_COMMAND.id,
      label: ServingCommands.SERVING_COMMAND.label,
      order: '112',
    });
  }

  async initializeLayout(): Promise<void> {
    await this.openView();
  }

  protected withWidget<T>(
    widget: Widget | undefined = this.tryGetWidget(),
    fn: (widget: ServingPanelWidget) => T,
  ): T | false {
    if (
      widget instanceof ServingPanelWidget &&
      widget.id === ServingPanelWidget.ID
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
