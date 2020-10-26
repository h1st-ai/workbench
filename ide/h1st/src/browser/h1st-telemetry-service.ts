import { FrontendApplicationContribution } from "@theia/core/lib/browser";
import { injectable, inject } from "inversify";
import Analytics, { AnalyticsInstance } from "analytics";
import googleAnalytics from "@analytics/google-analytics";
import { H1stBackendWithClientService } from "../common/protocol";

@injectable()
export class H1stTelemetryService implements FrontendApplicationContribution {
  private GA: AnalyticsInstance;
  @inject(H1stBackendWithClientService)
  private readonly h1stBackEndWithClientService: H1stBackendWithClientService;

  async initialize(): Promise<void> {
    console.log("Initializing telemetry service");

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

  async onStart() {
    console.log("Tracking initial page");
    // track initial page
    this.GA.page();
  }
}
