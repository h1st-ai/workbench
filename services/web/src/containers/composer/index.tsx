import React from 'react';
import { withKeycloak } from '@react-keycloak/web';
import { Provider, useDispatch } from 'react-redux';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Cookies from 'js-cookie';

import store from 'stores';
import { authActions } from 'reducers/auth';
import Dashboard from 'containers/dashboard';

function PrivateRoute({ children, authenticator, ...rest }: any) {
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

function setAuthInfo(token: string) {
  const dispatch = store.dispatch;
  dispatch(authActions.setToken({ token }));
  Cookies.set('token', token, { path: '/' });
}

function Authenticator({ auth }: any) {
  console.log('Authenticator ', auth, auth.authenticated);

  if (auth.authenticated) {
    setAuthInfo(auth.token);
  }

  auth.onAuthSuccess = function () {
    setAuthInfo(auth.token);
  };

  auth.onAuthRefreshSuccess = function () {
    setAuthInfo(auth.token);
  };

  return null;
}

function Composer({ keycloak, keycloakInitialized }: any) {
  return (
    <Provider store={store}>
      <Authenticator auth={keycloak} />
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
