import * as React from 'react';
import {
  Message,
  NavigatableWidget,
  ReactWidget,
} from '@theia/core/lib/browser';
import { injectable } from 'inversify';
import URI from '@theia/core/lib/common/uri';
import { GraphContainer } from './containers/GraphContainer';
import { configureStore } from '@reduxjs/toolkit';
import reducer from './reducers';
import { H1stBackendWithClientService } from '../../../common/protocol';
import { GraphVisualizationContextProvider } from './context';

@injectable()
export class H1stGraphWidget extends ReactWidget implements NavigatableWidget {
  static readonly ID = 'h1st:graph:widget';
  private readonly store: any;
  private readonly service: H1stBackendWithClientService;

  constructor(readonly uri: URI, service: H1stBackendWithClientService) {
    super();
    // Init store from Widget
    this.store = configureStore({ reducer, devTools: true });
    this.service = service;
  }

  getResourceUri(): URI {
    return this.uri;
  }

  createMoveToUri(): URI {
    return this.uri;
  }

  protected async onAfterAttach(msg: Message): Promise<void> {
    super.onAfterAttach(msg);

    console.log('On after attach', msg, this.isVisible);
    this.update();
  }

  protected async onActivateRequest(msg: Message) {
    super.onActivateRequest(msg);
  }

  protected render(): React.ReactNode {
    return (
      <GraphVisualizationContextProvider
        value={{
          backendService: this.service,
        }}
      >
        <div className="h1st-graph" style={{ height: '100%' }}>
          <GraphContainer store={this.store} />
        </div>
      </GraphVisualizationContextProvider>
    );
  }
}
