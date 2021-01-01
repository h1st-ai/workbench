import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import {
  WebSocketConnectionProvider,
  FrontendApplicationContribution,
  bindViewContribution,
  WidgetFactory,
  OpenHandler,
  LabelProviderContribution,
} from '@theia/core/lib/browser';
import { ContainerModule, injectable } from 'inversify';
import { TabBarToolbarContribution } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import {
  BackendClient,
  H1stBackendWithClientService,
  H1stBackendService,
  H1ST_BACKEND_PATH,
  H1ST_BACKEND_WITH_CLIENT_PATH,
  IBackendClient,
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
import { H1stHeaderContribution } from './packages/widgets/h1st-view-contribution';
import { AccountWidget } from './packages/widgets/account';
import { H1stTelemetryService } from './h1st-telemetry-service';
import { H1stAuthService } from './auth-service';

// tuning
import { ExperimentWidgetFactory } from './packages/tune/experiment-widget-factory';
import { TuningContribution } from './packages/tune/contribution';
import { ExperimentListWidget } from './packages/tune';
import { TuningOpener } from './packages/tune/opener';
import { TuningUriLabelProviderContribution } from './packages/tune/experiment-uris';

import { GraphFactory } from './packages/visualization/graph-factory';
import { GraphOpener } from './packages/visualization/opener';
import { NotebookFactory } from './packages/notebook/notebook-factory';
import { NotebookOpener } from './packages/notebook/opener';
import { ShareDialog } from './packages/widgets/share-dialog';

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
  bind(LabelProviderContribution)
    .to(TuningUriLabelProviderContribution)
    .inSingletonScope();

  bind(ExperimentListWidget).toSelf();
  // .inSingletonScope();
  bind<WidgetFactory>(WidgetFactory).toDynamicValue(ctx => ({
    id: ExperimentListWidget.ID,
    createWidget: () => ctx.container.get(ExperimentListWidget),
  }));

  bind(GraphOpener).toSelf();
  bind(OpenHandler).toService(GraphOpener);

  bind(GraphFactory)
    .toSelf()
    .inSingletonScope();
  bind(WidgetFactory).toService(GraphFactory);

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

  bind(ShareDialog)
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
      const backendClient: IBackendClient = ctx.container.get(BackendClient);
      return connection.createProxy<H1stBackendWithClientService>(
        H1ST_BACKEND_WITH_CLIENT_PATH,
        backendClient,
      );
    })
    .inSingletonScope();
});

@injectable()
class BackendClientImpl implements IBackendClient {
  getName(): Promise<string> {
    return new Promise(resolve => resolve('H1stClient'));
  }
}
