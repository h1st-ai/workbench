import * as React from 'react';
import {
  Message,
  NavigatableWidget,
  ReactWidget,
  StatefulWidget,
} from '@theia/core/lib/browser';
import { injectable } from 'inversify';
import URI from '@theia/core/lib/common/uri';

@injectable()
export class ExperimentWidget extends ReactWidget
  implements NavigatableWidget, StatefulWidget {
  private _name: string;

  constructor({ name }: any) {
    super();
    this._name = name;
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
    return new URI();
  }

  createMoveToUri(): URI {
    return new URI();
  }

  onActivateRequest(msg: Message) {
    super.onActivateRequest(msg);
    this.node.focus();
    this.update();
  }

  render(): React.ReactNode {
    return <p>Widget</p>;
  }
}
