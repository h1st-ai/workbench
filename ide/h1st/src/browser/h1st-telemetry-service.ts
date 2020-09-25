import { FrontendApplicationContribution } from "@theia/core/lib/browser";
import { injectable, inject, postConstruct } from "inversify";
import Analytics, { AnalyticsInstance } from "analytics";
import googleAnalytics from "@analytics/google-analytics";
import { H1stBackendWithClientService } from "../common/protocol";

@injectable()
export class H1stTelemetryService implements FrontendApplicationContribution {
  private GA: AnalyticsInstance;
  @inject(H1stBackendWithClientService)
  private readonly h1stBackEndWithClientService: H1stBackendWithClientService;

  @postConstruct()
  protected async init(): Promise<void> {
    const trackingId = await this.h1stBackEndWithClientService.getConfig(
      "GA_ID"
    );

    this.GA = Analytics({
      app: "h1st-workbench",
      plugins: [
        googleAnalytics({
          trackingId,
        }),
      ],
    });

    console.log("Telemetry service initialized ", trackingId);
  }

  logFileChangedEvent() {
    /* Track a custom event */
    this.GA.track("fileChanged", {
      category: "Workbench - File Operation",
      label: "Workbench Active Hours",
      value: 42,
    });
  }

  onStart() {
    // track initial page
    console.log("Telemetry: tracking intial page");
    this.GA.page();
  }
}
