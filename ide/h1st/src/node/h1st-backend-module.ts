import { ConnectionHandler, JsonRpcConnectionHandler } from '@theia/core';
import { ContainerModule } from 'inversify';
import {
  IBackendClient,
  H1stBackendWithClientService,
  H1stBackendService,
  H1ST_BACKEND_PATH,
  H1ST_BACKEND_WITH_CLIENT_PATH,
} from '../common/protocol';
import { H1stBackendWithClientServiceImpl } from './h1st-backend-with-client-service';
import { H1stBackendServiceImpl } from './h1st-backend-service';

export default new ContainerModule(bind => {
  bind(H1stBackendService)
    .to(H1stBackendServiceImpl)
    .inSingletonScope();
  bind(ConnectionHandler)
    .toDynamicValue(
      ctx =>
        new JsonRpcConnectionHandler(H1ST_BACKEND_PATH, () => {
          return ctx.container.get<H1stBackendService>(H1stBackendService);
        }),
    )
    .inSingletonScope();

  bind(H1stBackendWithClientService)
    .to(H1stBackendWithClientServiceImpl)
    .inSingletonScope();
  bind(ConnectionHandler)
    .toDynamicValue(
      ctx =>
        new JsonRpcConnectionHandler<IBackendClient>(
          H1ST_BACKEND_WITH_CLIENT_PATH,
          client => {
            const server = ctx.container.get<H1stBackendWithClientServiceImpl>(
              H1stBackendWithClientService,
            );
            server.setClient(client);
            client.onDidCloseConnection(() => server.dispose());
            return server;
          },
        ),
    )
    .inSingletonScope();
});
