import * as React from "react";
import { inject, injectable } from "inversify";
import {
  AboutDialog,
  AboutDialogProps,
} from "@theia/core/lib/browser/about-dialog";

export const ABOUT_CONTENT_CLASS = "theia-aboutDialog";

@injectable()
export class H1stAboutDialog extends AboutDialog {
  constructor(
    @inject(AboutDialogProps) protected readonly props: AboutDialogProps
  ) {
    super(props);
  }

  protected render(): React.ReactNode {
    return (
      <div className={ABOUT_CONTENT_CLASS}>
        {this.renderHeader()}
        {this.renderCotent()}
      </div>
    );
  }

  protected renderCotent(): React.ReactNode {
    const applicationInfo = this.applicationInfo;
    return (
      applicationInfo && (
        <h3>
          {applicationInfo.name} {applicationInfo.version}
        </h3>
      )
    );
  }

  protected renderHeader(): React.ReactNode {
    const applicationInfo = this.applicationInfo;
    return (
      applicationInfo && (
        <h3>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="16" fill="white" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.2442 6C21.297 6 24.4736 10.0724 24.4736 10.0724L30.4038 16L24.4762 21.9276C24.4762 21.9276 21.3023 26 16.2468 26C11.1913 26 7.92759 21.9276 7.92759 21.9276L2 16L7.92759 10.0724C7.92759 10.0724 11.1913 6 16.2442 6ZM23.3187 16C23.3187 19.9305 20.1324 23.1168 16.2019 23.1168C12.2714 23.1168 9.08507 19.9305 9.08507 16C9.08507 12.0695 12.2714 8.88317 16.2019 8.88317C20.1324 8.88317 23.3187 12.0695 23.3187 16Z"
              fill="#2241B0"
            />
            <path
              d="M16.9471 12.0941V15.3472H15.454V14.3642H13.9662C13.9662 14.3642 15.454 13.4736 15.454 12.0941H12.103V19.9059H15.454V17.139H16.9471V19.9059H20.2981V12.0941H16.9471Z"
              fill="#2241B0"
            />
          </svg>
        </h3>
      )
    );
  }
}
