import * as React from "react";
import { injectable, postConstruct, inject } from "inversify";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { MessageService } from "@theia/core";

@injectable()
export class H1stHeaderWidget extends ReactWidget {
  static readonly ID = "h1st:header:widget";
  static readonly LABEL = "H1stHeader Widget";

  @inject(MessageService)
  protected readonly messageService!: MessageService;

  @postConstruct()
  protected async init(): Promise<void> {
    this.id = H1stHeaderWidget.ID;
    this.title.label = H1stHeaderWidget.LABEL;
    this.title.caption = H1stHeaderWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = "fa fa-window-maximize"; // example widget icon.
    this.update();
  }

  protected render(): React.ReactNode {
    return (
      <a href="/">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.94975 2.00002L2 6.94977L6.94975 11.8995"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.94975 2.00002L2 6.94977L6.94975 11.8995"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="4"
            y1="7"
            x2="12"
            y2="7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="4"
            y1="7"
            x2="12"
            y2="7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back To Dashboard
      </a>
    );
  }

  protected displayMessage(): void {
    this.messageService.info(
      "Congratulations: H1stHeader Widget Successfully Created!"
    );
  }
}
