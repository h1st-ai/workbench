import * as React from "react";
import { injectable, postConstruct, inject } from "inversify";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { Account } from "./account";
import { H1stAuthService } from "../../auth-service";
import { KeycloakInstance } from "keycloak-js";
import { CommandService } from "@theia/core";

@injectable()
export class AccountWidget extends ReactWidget {
  static readonly ID = "h1st:header:widget";
  static readonly LABEL = "H1stHeader Widget";

  @inject(H1stAuthService) readonly h1stAuthService: H1stAuthService;
  @inject(CommandService) readonly commands: CommandService;

  @postConstruct()
  protected async init(): Promise<void> {
    this.id = AccountWidget.ID;
    this.title.label = AccountWidget.LABEL;
    this.title.caption = AccountWidget.LABEL;
    this.title.closable = false;
    // this.title.iconClass = "fa fa-window-maximize";
    this.update();
  }

  protected render(): React.ReactNode {
    const keycloak: KeycloakInstance = this.h1stAuthService.authenticator;

    return <Account keycloak={keycloak} commands={this.commands} />;
  }
}
