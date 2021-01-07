import { EnhancedStore } from '@reduxjs/toolkit';
import { expActions } from './reducers/experiment';
import { IExperiment } from './types';
// import { ExperimentWidgetFactory } from './experiment-widget-factory';
import { FrontendApplication, WidgetManager } from '@theia/core/lib/browser';
import { OpenerService, open } from '@theia/core/lib/browser/opener-service';
import { ServingUris } from './experiment-uris';

// import { ExperimentWidget } from './expriment-widget';
// import { WidgetManager } from '@theia/core/lib/browser';

const uniqid = require('uniqid');

interface ITuningManagerOptions {
  store: EnhancedStore;
  app: FrontendApplication;
  widgetManager: WidgetManager;
  openerService: OpenerService;
}

export class ServingManager {
  private store: EnhancedStore;
  private readonly app: FrontendApplication;
  private readonly widgetManager: WidgetManager;
  private readonly openerService: OpenerService;

  // @inject(ExperimentWidgetFactory)
  // private expWidgetFactory: ExperimentWidgetFactory;

  constructor({
    store,
    app,
    widgetManager,
    openerService,
  }: ITuningManagerOptions) {
    this.store = store;
    this.app = app;
    this.widgetManager = widgetManager;
    this.openerService = openerService;

    console.log(this.app, this.widgetManager, this.openerService);
  }

  async createNewExperiment() {
    const state = this.store.getState();
    const id = uniqid();

    const name = `Experiment #${state.tunes.data.length + 1}`;

    const exp: IExperiment = {
      id,
      name,
    };
    const { addExperiments } = expActions;

    this.store.dispatch(addExperiments({ data: [exp] }));

    open(this.openerService, ServingUris.encode(id, name), {
      mode: 'activate',
      name,
      id,
    });

    // const widget = this.expWidgetFactory.createWidget({ name, id });
    // console.log('widget', widget);

    // const widget = await this.widgetManager.getOrCreateWidget(
    //   ExperimentWidgetFactory.ID,
    //   { name, id },
    // );

    // await this.app.shell.addWidget(widget, { area: 'main', rank: 1000 });
    // // this.
    // widget.show();
    // this.widgetOpenHandler.open(new URI(`tune://widget${id}`), {
    //   mode: 'activate',
    // });
    // widget.console.log('store', this.store);
  }
}
