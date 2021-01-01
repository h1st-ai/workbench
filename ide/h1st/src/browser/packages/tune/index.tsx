import * as React from 'react';
// import * as ReactDOM from "react-dom";
import { inject, injectable, postConstruct } from 'inversify';
import {
  FrontendApplication,
  Message,
  OpenerService,
  ReactWidget,
} from '@theia/core/lib/browser';
import { Emitter, Event } from '@theia/core';
import { EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { WidgetManager } from '@theia/core/lib/browser';

import store from './stores';
import TuningContext from './context';
import { ITuningContext } from './types';
import { TuningManager } from './tuning-manager';
import { ExperimentList } from './components/experiment-list';

@injectable()
export class ExperimentListWidget extends ReactWidget {
  static readonly ID = 'h1st:tune:sidebar:widget';
  static readonly LABEL = 'Hyper Parameter Tuning';

  protected readonly onDidUpdateEmitter = new Emitter<void>();
  readonly onDidUpdate: Event<void> = this.onDidUpdateEmitter.event;
  protected tuningManager: TuningManager;
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
  ) {
    super();
    this.store = store;
    console.log('experiment list', widgetManager, app);
    this.tuningManager = new TuningManager({
      store,
      app,
      widgetManager,
      openerService,
    });

    // this.tuningManager = new TuningManager({
    //   store,
    //   shell: shell,
    //   widgetManager: widgetManager,
    // });

    this.addClass('h1st-tuning');
    this.addClass('h1st-tuning-main-container');
  }

  get manager(): TuningManager {
    return this.tuningManager;
  }

  @postConstruct()
  protected async init(): Promise<void> {
    this.id = ExperimentListWidget.ID;
    this.title.label = ExperimentListWidget.LABEL;
    this.title.caption = ExperimentListWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = 'sidebar-tuning-icon';

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
          <ExperimentList />
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
