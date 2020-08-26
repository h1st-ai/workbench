import Keycloak from 'keycloak-js';

const keycloak = new (Keycloak as any)({
  realm: 'h1st',
  url: 'http://localhost:8080/auth', // TODO parameterize this
  clientId: 'h1st-workbench-web',
});

export default keycloak;