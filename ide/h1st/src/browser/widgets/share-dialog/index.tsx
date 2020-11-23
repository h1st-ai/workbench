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

export const ABOUT_CONTENT_CLASS = "theia-aboutDialog";

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
        <div>Collaborator list</div>
      </>
    );
  }

  protected render(): React.ReactNode {
    console.log("Call render");
    return (
      <div className={"share-dialog-content"}>
        {this.renderCollaboratorInput()}
        {this.renderCollaboratorList()}
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
