import React, { useEffect } from 'react';
import { withKeycloak } from '@react-keycloak/web';
import { Provider, useDispatch } from 'react-redux';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Cookies from 'js-cookie';

import store from 'stores';
import { authActions } from 'reducers/auth';
import Dashboard from 'containers/dashboard';

declare global {
  interface Window {
    hj: any;
  }
}

function PrivateRoute({ children, authenticator, ...rest }: any) {
  if (!authenticator) {
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

async function setUpTracking(auth: any) {
  if (auth.authenticated) {
    const p = await auth.loadUserProfile();

    const hj = window.hj;

    if (hj) {
      hj('identify', p.username, {
        email: p.email,
      });
    }
  }
}

function Authenticator({ auth }: any) {
  if (auth.authenticated) {
    setAuthInfo(auth.token);

    setUpTracking(auth);
  }

  auth.onAuthSuccess = async function () {
    setAuthInfo(auth.token);
  };

  auth.onAuthRefreshSuccess = function () {
    setAuthInfo(auth.token);
  };

  // useEffect(() => {
  //   const { REACT_APP_HOTJAR_ID, REACT_APP_HOTJAR_SNIPPET_VER } = process.env;
  //   const hjid = REACT_APP_HOTJAR_ID ? parseInt(REACT_APP_HOTJAR_ID) : 1977686;
  //   const hjsv = REACT_APP_HOTJAR_SNIPPET_VER
  //     ? parseInt(REACT_APP_HOTJAR_SNIPPET_VER)
  //     : 6;

  //   console.log('initialize tracking', hjid, hjsv);
  //   hotjar.initialize(hjid, hjsv);
  // });

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
