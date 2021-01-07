import * as React from 'react';
// import * as ReactDOM from "react-dom";
import { inject, injectable, postConstruct } from 'inversify';
import {
  FrontendApplication,
  Message,
  OpenerService,
  ReactWidget,
} from '@theia/core/lib/browser';
import { Emitter, Event, CommandService } from '@theia/core';
import { EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { WidgetManager } from '@theia/core/lib/browser';

import store from './stores';
import TuningContext from './context';
import { ITuningContext } from './types';
import { ServingManager } from './serving-manager';
import { ServingPanel } from './components/servingPanel';

@injectable()
export class ServingPanelWidget extends ReactWidget {
  static readonly ID = 'h1st:serving:sidebar:widget';
  static readonly LABEL = 'Serving';

  protected readonly onDidUpdateEmitter = new Emitter<void>();
  readonly onDidUpdate: Event<void> = this.onDidUpdateEmitter.event;
  protected tuningManager: ServingManager;
  protected store: EnhancedStore;

  // @inject(ApplicationShell)
  // protected readonly shell: ApplicationShell;

  // @inject(WidgetManager)
  // protected readonly widgetManager: WidgetManager;

  constructor(
    @inject(FrontendApplication)
    protected app: FrontendApplication,
    @inject(WidgetManager)
    protected widgetManager: WidgetManager,
    @inject(OpenerService) protected openerService: OpenerService,
    @inject(CommandService) readonly commandService: CommandService,
  ) {
    super();
    this.store = store;
    this.tuningManager = new ServingManager({
      store,
      app,
      widgetManager,
      openerService,
    });

    // this.tuningManager = new ServingManager({
    //   store,
    //   shell: shell,
    //   widgetManager: widgetManager,
    // });

    this.addClass('h1st-serving');
    this.addClass('h1st-serving-main-container');
  }

  get manager(): ServingManager {
    return this.tuningManager;
  }

  @postConstruct()
  protected async init(): Promise<void> {
    this.id = ServingPanelWidget.ID;
    this.title.label = ServingPanelWidget.LABEL;
    this.title.caption = ServingPanelWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = 'sidebar-serving-icon';

    this.update();
  }

  protected onUpdateRequest(msg: Message): void {
    super.onUpdateRequest(msg);
    this.onDidUpdateEmitter.fire(undefined);
  }

  protected render(): React.ReactNode {
    const contextValue: ITuningContext = {
      manager: this.tuningManager,
    };

    return (
      <TuningContext.Provider value={contextValue}>
        <Provider store={this.store}>
          <ServingPanel
            commandService={this.commandService}
            manager={this.tuningManager}
          />
        </Provider>
      </TuningContext.Provider>
    );
  }

  protected onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);
    // ReactDOM.render(
    //   <React.Fragment>{this.renderList()}</React.Fragment>,
    //   this.contentNode
    // );
    // Widget.attach(this.resultTreeWidget, this.contentNode);
    // this.toDisposeOnDetach.push(
    //   Disposable.create(() => {
    //     Widget.detach(this.resultTreeWidget);
    //   })
    // );
    this.update();
  }

  protected onActivateRequest(msg: Message): void {
    super.onActivateRequest(msg);
    this.node.focus();
  }
}
