import * as React from 'react';

import { inject, injectable, postConstruct } from 'inversify';
import { AboutDialogProps } from '@theia/core/lib/browser/about-dialog';
import { ReactDialog } from '@theia/core/lib/browser/dialogs/react-dialog';
import { KeycloakInstance } from 'keycloak-js';
import {
  ApplicationInfo,
  ApplicationServer,
  ExtensionInfo,
} from '@theia/core/lib/common/application-protocol';
import { Message } from '@theia/core/lib/browser/widgets';

import ShareDialogComponent from './dialog';

import { H1stAuthService } from '../../auth-service';
import { H1stBackendWithClientService } from '../../../common/protocol';
import { CommandService, MessageService } from '@theia/core';

export const ABOUT_CONTENT_CLASS = 'theia-aboutDialog';

@injectable()
export class ShareDialog extends ReactDialog<void> {
  protected applicationInfo: ApplicationInfo | undefined;
  protected extensionsInfos: ExtensionInfo[] = [];
  protected readonly okButton: HTMLButtonElement;
  protected keycloak: KeycloakInstance;
  protected workspaceId: string;

  constructor(
    @inject(AboutDialogProps) readonly props: AboutDialogProps,
    @inject(H1stBackendWithClientService)
    readonly h1stBackendWithClientService: H1stBackendWithClientService,
    @inject(H1stAuthService) readonly h1stAuthService: H1stAuthService,
    @inject(MessageService) readonly messageService: MessageService,
    @inject(CommandService) readonly commandService: CommandService,
    @inject(ApplicationServer) readonly appServer: ApplicationServer,
  ) {
    super({
      title: 'Share this project',
    });

    this.addClass('h1st-share-modal');
    this.keycloak = this.h1stAuthService.authenticator;

    const matches = window.location.pathname.match(/\/project\/([a-z0-9]+)/);

    if (matches) {
      this.workspaceId = matches[1];
    }
  }

  @postConstruct()
  protected async init(): Promise<void> {
    this.applicationInfo = await this.appServer.getApplicationInfo();
    this.extensionsInfos = await this.appServer.getExtensionsInfos();
    this.update();
  }

  protected render(): React.ReactNode {
    return (
      <ShareDialogComponent
        keycloak={this.keycloak}
        workspaceId={this.workspaceId}
        service={this.h1stBackendWithClientService}
        messageService={this.messageService}
        commands={this.commandService}
      />
    );
  }

  protected onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);
    this.update();
  }

  get value(): undefined {
    return undefined;
  }
}
