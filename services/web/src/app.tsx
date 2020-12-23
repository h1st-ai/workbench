import React from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import Cookies from 'js-cookie';
import Composer from 'containers/composer';
import { authActions } from 'reducers/auth';
import keycloak from './auth';

import store from 'stores';

import 'app.css';

export function LoadingCheck() {
  return <p>Loading...</p>;
}

function setAuthInfo(token: string | undefined) {
  const dispatch = store.dispatch;
  dispatch(authActions.setToken({ token }));
  Cookies.set('token', token || '', { path: '/' });
}

export default function App() {
  const onEvent = (event: any, data: any) => {
    console.log('On event', event, data);
  };

  const onTokens = (data: any) => {
    setAuthInfo(data.token);
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
