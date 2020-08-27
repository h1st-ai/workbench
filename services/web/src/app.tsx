import React from 'react';
import { KeycloakProvider } from '@react-keycloak/web';
import Composer from 'containers/composer';
import keycloak from './auth';

import 'app.css';

export default function App() {
  return (
    <KeycloakProvider keycloak={keycloak}>
      <Composer />
    </KeycloakProvider>
  );
}
