import Keycloak from 'keycloak-js';
import config from 'config';

const authenticator = new (Keycloak as any)({
  realm: 'h1st',
  url: config.AUTH.URL, // TODO parameterize this
  clientId: 'h1st-workbench-web',
});

export default authenticator;
