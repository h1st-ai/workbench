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

function Authenticator({ auth }: any) {
  console.log('Authenticator ', auth, auth.authenticated);
  const dispatch = useDispatch();

  if (auth.authenticated) {
    dispatch(authActions.setToken({ token: auth.token }));
  }

  auth.onAuthSuccess = function () {
    const token = auth.token;
    console.log('auth success');
    dispatch(authActions.setToken({ token }));
    Cookies.set('token', token, { path: '/' });
  };

  auth.onAuthRefreshSuccess = function () {
    const token = auth.token;
    console.log('auth refresh success');
    dispatch(authActions.setToken({ token }));
    Cookies.set('token', token, { path: '/' });
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
