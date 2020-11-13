import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import {
  WebSocketConnectionProvider,
  FrontendApplicationContribution,
  bindViewContribution,
  WidgetFactory,
  OpenHandler,
} from '@theia/core/lib/browser';
import { ContainerModule, injectable } from 'inversify';
import { TabBarToolbarContribution } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import {
  BackendClient,
  H1stBackendWithClientService,
  H1stBackendService,
  H1ST_BACKEND_PATH,
  H1ST_BACKEND_WITH_CLIENT_PATH,
} from '../common/protocol';

import {
  H1stCommandContribution,
  H1stMenuContribution,
} from './h1st-contribution';

import './branding';

import '../../src/browser/style/index.css';
import { H1stFrontendApplicationContribution } from './h1st-frontend-contribution';
import { H1stWorkspaceService } from './h1st-workspace-contribution';
import { H1stAboutDialog } from './style/about-dialog';
import { H1stHeaderContribution } from './widgets/h1st-view-contribution';
import { AccountWidget } from './widgets/account';
import { H1stTelemetryService } from './h1st-telemetry-service';
import { H1stAuthService } from './auth-service';

import { NotebookFactory } from './notebook/notebook-factory';
import { NotebookOpener } from './notebook/opener';

// tuning
import { ExperimentWidgetFactory } from './tune/experiment-widget-factory';
import { TuningContribution } from './tune/contribution';
import { ExperimentListWidget } from './tune';
import { TuningOpener } from './tune/opener';

export default new ContainerModule((bind, unbind) => {
  bind(NotebookOpener).toSelf();
  bind(OpenHandler).toService(NotebookOpener);

  bind(NotebookFactory)
    .toSelf()
    .inSingletonScope();
  bind(WidgetFactory).toService(NotebookFactory);

  bind(TuningOpener).toSelf();
  bind(OpenHandler).toService(TuningOpener);
  bind(ExperimentWidgetFactory)
    .toSelf()
    .inSingletonScope();
  bind(WidgetFactory).toService(ExperimentWidgetFactory);

  bind(ExperimentListWidget).toSelf();
  // .inSingletonScope();
  bind<WidgetFactory>(WidgetFactory).toDynamicValue(ctx => ({
    id: ExperimentListWidget.ID,
    createWidget: () => ctx.container.get(ExperimentListWidget),
  }));
  bindViewContribution(bind, H1stHeaderContribution);
  bind(FrontendApplicationContribution).toService(H1stHeaderContribution);

  bindViewContribution(bind, TuningContribution);
  bind(FrontendApplicationContribution).toService(TuningContribution);
  bind(TabBarToolbarContribution).toService(TuningContribution);

  bind(FrontendApplicationContribution).toService(H1stAuthService);
  bind(H1stAuthService)
    .toSelf()
    .inSingletonScope();

  bind(FrontendApplicationContribution).toService(H1stTelemetryService);
  bind(H1stTelemetryService)
    .toSelf()
    .inSingletonScope();

  bind(AccountWidget)
    .toSelf()
    .inSingletonScope();

  bind(WidgetFactory)
    .toDynamicValue(ctx => ({
      id: AccountWidget.ID,
      createWidget: () => ctx.container.get<AccountWidget>(AccountWidget),
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
    .toDynamicValue(ctx => {
      const connection = ctx.container.get(WebSocketConnectionProvider);
      return connection.createProxy<H1stBackendService>(H1ST_BACKEND_PATH);
    })
    .inSingletonScope();

  bind(H1stBackendWithClientService)
    .toDynamicValue(ctx => {
      const connection = ctx.container.get(WebSocketConnectionProvider);
      const backendClient: BackendClient = ctx.container.get(BackendClient);
      return connection.createProxy<H1stBackendWithClientService>(
        H1ST_BACKEND_WITH_CLIENT_PATH,
        backendClient,
      );
    })
    .inSingletonScope();
});

@injectable()
class BackendClientImpl implements BackendClient {
  getName(): Promise<string> {
    return new Promise(resolve => resolve('H1stClient'));
  }
}
