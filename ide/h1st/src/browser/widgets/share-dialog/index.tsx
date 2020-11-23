import * as React from "react";
import { inject, injectable, postConstruct } from "inversify";
import { AboutDialogProps } from "@theia/core/lib/browser/about-dialog";
import { ReactDialog } from "@theia/core/lib/browser/dialogs/react-dialog";
import {
  ApplicationInfo,
  ApplicationServer,
  ExtensionInfo,
} from "@theia/core/lib/common/application-protocol";
import { Message } from "@theia/core/lib/browser/widgets";
import { Collaborator } from "./shareDialog";
import Icon from "../../notebook/components/icon";

export const ABOUT_CONTENT_CLASS = "theia-aboutDialog";

const CollaboratorItem = ({
  avatar,
  name,
  email,
  isOwner = false,
}: Collaborator) => {
  return (
    <div className="collaborator-item">
      <div className="collaborator-info">
        <div className="avatar">
          <img src={avatar} />
        </div>
        <div className="info">
          <div className="name">
            <span>{name}</span>
            {isOwner && <span className="owner">OWNER</span>}
          </div>
          <div className="email">{email}</div>
        </div>
      </div>
      <div className="delete-button">
        <Icon icon="trash-bin" />
      </div>
    </div>
  );
};

@injectable()
export class ShareDialog extends ReactDialog<void> {
  protected applicationInfo: ApplicationInfo | undefined;
  protected extensionsInfos: ExtensionInfo[] = [];
  protected readonly okButton: HTMLButtonElement;

  @inject(ApplicationServer)
  protected readonly appServer: ApplicationServer;

  constructor(
    @inject(AboutDialogProps) protected readonly props: AboutDialogProps
  ) {
    super({
      title: "Share this project",
    });

    this.addClass("h1st-share-modal");
  }

  @postConstruct()
  protected async init(): Promise<void> {
    this.applicationInfo = await this.appServer.getApplicationInfo();
    this.extensionsInfos = await this.appServer.getExtensionsInfos();
    this.update();
  }

  protected renderCollaboratorInput(): React.ReactNode {
    return (
      <>
        <div>Collaborator</div>
        <input />
      </>
    );
  }

  protected renderCollaboratorList(): React.ReactNode {
    return (
      <>
        <CollaboratorItem
          avatar="https://merics.org/sites/default/files/styles/ct_team_member_default/public/2020-04/avatar-placeholder.png?itok=Vhm0RCa3"
          name="John Smith"
          email="john@ma.il"
          isOwner={true}
        />
        <CollaboratorItem
          avatar="https://merics.org/sites/default/files/styles/ct_team_member_default/public/2020-04/avatar-placeholder.png?itok=Vhm0RCa3"
          name="Adam Levine"
          email="adam@ma.il"
          isOwner={false}
        />
        <CollaboratorItem
          avatar="https://merics.org/sites/default/files/styles/ct_team_member_default/public/2020-04/avatar-placeholder.png?itok=Vhm0RCa3"
          name="David Jackson"
          email="david@ma.il"
          isOwner={false}
        />
      </>
    );
  }

  private renderActionButton = (): React.ReactNode => {
    return (
      <div className="acction-button-section">
        <button className="action-button primary">Share</button>
        <button
          className="action-button secondary"
          onClick={() => this.close()}
        >
          Cancel
        </button>
      </div>
    );
  };

  protected render(): React.ReactNode {
    return (
      <div className={"share-dialog-content"}>
        {this.renderCollaboratorInput()}
        {this.renderCollaboratorList()}
        {this.renderActionButton()}
      </div>
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
