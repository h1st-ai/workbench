import { CommandContribution, MenuContribution } from "@theia/core/lib/common";
import {
  WebSocketConnectionProvider,
  FrontendApplicationContribution,
  bindViewContribution,
  WidgetFactory,
  OpenHandler,
} from "@theia/core/lib/browser";
import { ContainerModule, injectable } from "inversify";
import {
  BackendClient,
  H1stBackendWithClientService,
  H1stBackendService,
  H1ST_BACKEND_PATH,
  H1ST_BACKEND_WITH_CLIENT_PATH,
} from "../common/protocol";

import {
  H1stCommandContribution,
  H1stMenuContribution,
} from "./h1st-contribution";

import "./branding";

import "../../src/browser/style/index.css";
import { H1stFrontendApplicationContribution } from "./h1st-frontend-contribution";
import { H1stWorkspaceService } from "./h1st-workspace-contribution";
import { H1stAboutDialog } from "./style/about-dialog";
import { H1stHeaderContribution } from "./widgets/h1st-view-contribution";
import { H1stHeaderWidget } from "./widgets/h1st-header-widget";
import { H1stTelemetryService } from "./h1st-telemetry-service";

import { H1stNotebookWidgetFactory } from "./notebook/h1st-notebook-widget-factory";
import { NotebookManager } from "./notebook/h1st-notebook-manager";

export default new ContainerModule((bind, unbind) => {
  bind(NotebookManager).toSelf();
  bind(OpenHandler).toService(NotebookManager);

  bind(H1stNotebookWidgetFactory)
    .toSelf()
    .inSingletonScope();
  bind(WidgetFactory).toService(H1stNotebookWidgetFactory);

  bindViewContribution(bind, H1stHeaderContribution);
  bind(FrontendApplicationContribution).toService(H1stHeaderContribution);
  bind(FrontendApplicationContribution).toService(H1stTelemetryService);
  bind(H1stTelemetryService)
    .toSelf()
    .inSingletonScope();

  bind(H1stHeaderWidget)
    .toSelf()
    .inSingletonScope();

  bind(WidgetFactory)
    .toDynamicValue((ctx) => ({
      id: H1stHeaderWidget.ID,
      createWidget: () => ctx.container.get<H1stHeaderWidget>(H1stHeaderWidget),
    }))
    .inSingletonScope();

  bind(H1stAboutDialog)
    .toSelf()
    .inSingletonScope();
  bind(FrontendApplicationContribution).to(H1stFrontendApplicationContribution);
  bind(FrontendApplicationContribution).to(H1stWorkspaceService);

  bind(CommandContribution)
    .to(H1stCommandContribution)
    .inSingletonScope();

  bind(MenuContribution).to(H1stMenuContribution);
  bind(BackendClient)
    .to(BackendClientImpl)
    .inSingletonScope();

  bind(H1stBackendService)
    .toDynamicValue((ctx) => {
      const connection = ctx.container.get(WebSocketConnectionProvider);
      return connection.createProxy<H1stBackendService>(H1ST_BACKEND_PATH);
    })
    .inSingletonScope();

  bind(H1stBackendWithClientService)
    .toDynamicValue((ctx) => {
      const connection = ctx.container.get(WebSocketConnectionProvider);
      const backendClient: BackendClient = ctx.container.get(BackendClient);
      return connection.createProxy<H1stBackendWithClientService>(
        H1ST_BACKEND_WITH_CLIENT_PATH,
        backendClient
      );
    })
    .inSingletonScope();
});

@injectable()
class BackendClientImpl implements BackendClient {
  getName(): Promise<string> {
    return new Promise((resolve) => resolve("H1stClient"));
  }
}
