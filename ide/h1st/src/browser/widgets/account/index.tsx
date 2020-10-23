import * as React from "react";
import { injectable, postConstruct, inject } from "inversify";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { MessageService } from "@theia/core";
// import { ReactKeycloakProvider } from "@react-keycloak/web";

import * as keycloak from "keycloak-js";
import { Account } from "./account";

const Keycloak = require("keycloak-js");

@injectable()
export class AccountWidget extends ReactWidget {
  static readonly ID = "h1st:header:widget";
  static readonly LABEL = "H1stHeader Widget";

  protected keycloak: keycloak.KeycloakInstance;

  constructor() {
    super();

    // TODO load params from backend
    this.keycloak = new Keycloak({
      url: "http://localhost/access/auth",
      realm: "h1st",
      clientId: "h1st-workbench-web",
    });
  }

  @inject(MessageService)
  protected readonly messageService!: MessageService;

  @postConstruct()
  protected async init(): Promise<void> {
    this.id = AccountWidget.ID;
    this.title.label = AccountWidget.LABEL;
    this.title.caption = AccountWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = "fa fa-window-maximize"; // example widget icon.
    this.update();
  }

  protected render(): React.ReactNode {
    // const initOptions = {
    //   // onLoad: "login-required",
    //   checkLoginIframe: false,
    // };
    // return (
    //   <ReactKeycloakProvider
    //     authClient={this.keycloak}
    //     initOptions={initOptions}
    //   >
    //     <Account />
    //   </ReactKeycloakProvider>
    // );
    return <Account />;
  }
}
