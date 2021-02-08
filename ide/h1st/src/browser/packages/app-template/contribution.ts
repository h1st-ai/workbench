import { injectable, inject } from 'inversify';
import { AppTemplatePanelWidget } from './index';
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
import { AppTemplateUris } from './experiment-uris';

export namespace AppTemplateCommand {
  const APP_TEMPLATE_CATEGORY = 'AppTemplate';

  export const APP_TEMPLATE: Command = {
    id: 'h1st:app-template:open',
    label: 'App Template',
    category: APP_TEMPLATE_CATEGORY,
    // iconClass: 'add',
  };

  export const NEW_APP_TEMPLATE_PANEL: Command = {
    id: 'h1st:app-template:new',
    label: 'New Serving Panel',
    category: APP_TEMPLATE_CATEGORY,
    // iconClass: 'add',
  };

  export const APP_TEMPLATE_COMMAND: Command = {
    id: 'h1st:app-template:open-panel',
    label: 'Open App Template',
  };
}

export namespace ServingMenu {
  export const APP_TEMPLATE = [...TOOL_MENU, '3_app_template_submenu'];
}

@injectable()
export class AppTemplateDistribution
  extends AbstractViewContribution<AppTemplatePanelWidget>
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
      widgetId: AppTemplatePanelWidget.ID,
      widgetName: AppTemplatePanelWidget.LABEL,
      defaultWidgetOptions: { area: 'left', rank: 200 },
      toggleCommandId: AppTemplateCommand.APP_TEMPLATE_COMMAND.id,
    });
  }

  async onStart(app: FrontendApplication): Promise<void> {
    // alert("on start");
  }

  registerCommands(commands: CommandRegistry): void {
    super.registerCommands(commands);

    commands.registerCommand(AppTemplateCommand.APP_TEMPLATE, {
      isEnabled: widget => this.withWidget(widget, () => true),
      isVisible: widget => this.withWidget(widget, () => true),
      execute: () => {
        // console.log(JSON.stringify(arguments));
        console.log('inside handler');

        const name = `App template`;

        open(
          this.openerService,
          AppTemplateUris.encode('app-template-view', name),
          {
            mode: 'activate',
            name,
            id: 'app-serving-view',
          },
        );

        this.toggleView();

        // console.log('On execute with widget');
        // console.log('after widget');
        // manager.createNewExperiment();
        // manager.a();
        // console.log(widget);
      },
      // this.withWidget(widget, () => {
      //   console.log('hgaha', widget);
      //   (widget as AppTemplatePanelWidget).manager.createNewExperiment();
      // }),
    });
  }

  async registerToolbarItems(toolbar: TabBarToolbarRegistry): Promise<void> {
    const widget = await this.widget;
    const onDidChange = widget.onDidUpdate;
    // toolbar.registerItem({
    //   id: AppTemplateCommand.REFRESH.id,
    //   command: AppTemplateCommand.REFRESH.id,
    //   tooltip: AppTemplateCommand.REFRESH.label,
    //   priority: 2,
    //   onDidChange,
    // });

    toolbar.registerItem({
      id: AppTemplateCommand.NEW_APP_TEMPLATE_PANEL.id,
      command: AppTemplateCommand.NEW_APP_TEMPLATE_PANEL.id,
      tooltip: AppTemplateCommand.NEW_APP_TEMPLATE_PANEL.label,
      priority: 1,
      onDidChange,
    });
  }

  registerMenus(menus: MenuModelRegistry): void {
    menus.registerSubmenu(ServingMenu.APP_TEMPLATE, 'App template');

    menus.registerMenuAction(ServingMenu.APP_TEMPLATE, {
      commandId: AppTemplateCommand.APP_TEMPLATE_COMMAND.id,
      label: AppTemplateCommand.APP_TEMPLATE_COMMAND.label,
      order: '112',
    });
  }

  async initializeLayout(): Promise<void> {
    await this.openView();
  }

  protected withWidget<T>(
    widget: Widget | undefined = this.tryGetWidget(),
    fn: (widget: AppTemplatePanelWidget) => T,
  ): T | false {
    if (
      widget instanceof AppTemplatePanelWidget &&
      widget.id === AppTemplatePanelWidget.ID
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
