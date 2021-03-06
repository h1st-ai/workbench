import * as React from 'react';
import {
  Message,
  NavigatableWidget,
  ReactWidget,
  StatefulWidget,
} from '@theia/core/lib/browser';
import { injectable } from 'inversify';
import URI from '@theia/core/lib/common/uri';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import { TuningUris } from './experiment-uris';
import reducer from './reducers/widget';
import ExperimentContent from './components/widget';

@injectable()
export class ExperimentWidget extends ReactWidget
  implements NavigatableWidget, StatefulWidget {
  private _name: string;
  private _id: string;
  private _uri: URI;
  private _store: EnhancedStore;

  constructor({ name, id, uri }: any) {
    super();
    this._name = name;
    this._id = id;
    this._uri = uri;
    this._store = configureStore({ reducer, devTools: true });
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  storeState(): object {
    return {};
  }

  restoreState(state: object) {
    console.log('restoring state', state);
  }

  getResourceUri(): URI {
    return this._uri;
  }

  createMoveToUri(): URI {
    return TuningUris.encode(this._id, this._name);
  }

  onAfterAttach(msg: Message) {
    super.onAfterAttach(msg);

    if (this.isVisible) {
      this.update();
    }
  }

  onActivateRequest(msg: Message) {
    super.onActivateRequest(msg);
    this.update();
  }

  render(): React.ReactNode {
    return (
      <Provider store={this._store}>
        <ExperimentContent />
      </Provider>
    );
  }
}
