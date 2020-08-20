import Keycloak from 'keycloak-js';

const keycloak = new (Keycloak({
  realm: 'h1st',
  url: 'http://localhost:8080/auth',
  clientId: 'h1st-workbench-web',
}) as any)();

export default keycloak;
