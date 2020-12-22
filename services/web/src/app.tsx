import React from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import Composer from 'containers/composer';
import keycloak from './auth';

import 'app.css';

export function LoadingCheck() {
  return <p>Loading...</p>;
}

export default function App() {
  const onEvent = (event: any, data: any) => {
    console.log('On event', event, data);
  };

  const onTokens = (token: any) => {
    alert(token);
  };
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      onEvent={onEvent}
      onTokens={onTokens}
      LoadingComponent={<LoadingCheck />}
    >
      <Composer />
    </ReactKeycloakProvider>
  );
}
