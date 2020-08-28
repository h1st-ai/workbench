import React from 'react';
import { withKeycloak } from '@react-keycloak/web';
import { Provider } from 'react-redux';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';

import store from 'stores';
import Dashboard from 'containers/dashboard';

function PrivateRoute({ children, authenticator, ...rest }: any) {
  console.log('test', authenticator.keycloak.token);

  if (!authenticator) {
    console.log('no authenticator');
    return null;
  }

  return (
    <Route
      {...rest}
      render={({ location }) => {
        const { keycloak, keycloakInitialized } = authenticator;

        if (!keycloakInitialized) {
          return null;
        } else if (!keycloak.authenticated) {
          return keycloak.login();
        }

        return children;
      }}
    />
  );
}

function Composer({ keycloak, keycloakInitialized }: any) {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path="/p/{test}">
            <Dashboard />
          </Route>
          <PrivateRoute
            exact
            authenticator={{ keycloak, keycloakInitialized }}
            path="/"
          >
            <Dashboard />
          </PrivateRoute>
        </Switch>
      </Router>
    </Provider>
  );
}

export default withKeycloak(Composer);
