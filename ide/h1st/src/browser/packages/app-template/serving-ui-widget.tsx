import * as React from 'react';
import {
  Message,
  NavigatableWidget,
  ReactWidget,
  StatefulWidget,
} from '@theia/core/lib/browser';
import { injectable } from 'inversify';
import URI from '@theia/core/lib/common/uri';

import { AppTemplateUris } from './experiment-uris';
import { AppTemplateView } from './components/AppTemplateView';
import { H1stBackendWithClientService } from '../../../common/protocol';
import { CommandService, MessageService } from '@theia/core';
import { IAppTemplateContext } from './types';
import { AppTemplateContextProvider } from './context';

@injectable()
export class ServingUIWidget extends ReactWidget
  implements NavigatableWidget, StatefulWidget {
  private _name: string;
  private _id: string;
  private _uri: URI;
  private service: H1stBackendWithClientService;
  private messageService: MessageService;
  private commandService: CommandService;

  constructor({ name, id, uri, service, messageService, commandService }: any) {
    super();
    this._name = name;
    this._id = id;
    this._uri = uri;
    this.service = service;
    this.messageService = messageService;
    this.commandService = commandService;
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
    return AppTemplateUris.encode(this._id, this._name);
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
    const contextValue: IAppTemplateContext = {
      messageService: this.messageService,
      backendService: this.service,
      commandService: this.commandService,
      widget: this,
    };
    return (
      <AppTemplateContextProvider value={contextValue}>
        <AppTemplateView service={this.service} />;
      </AppTemplateContextProvider>
    );
  }
}
