import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Provider } from 'react-redux';

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

function PrivateRoute({ children, ...rest }: any) {
  const { keycloak, initialized } = useKeycloak();
  alert(initialized);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (!initialized) {
          return null;
        } else if (!keycloak.authenticated) {
          return keycloak.login();
        }

        return children;
      }}
    />
  );
}

function setAuthInfo(token: string | undefined) {
  const dispatch = store.dispatch;
  dispatch(authActions.setToken({ token }));
  Cookies.set('token', token || '', { path: '/' });
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

function Authenticator() {
  const { keycloak: auth, initialized } = useKeycloak();

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

function Composer() {
  const { keycloak, initialized } = useKeycloak();

  return (
    <Provider store={store}>
      <Authenticator />
      <Router>
        <Switch>
          <Route path="/p/{test}">
            <Dashboard />
          </Route>
          <PrivateRoute exact path="/">
            <Dashboard />
          </PrivateRoute>
        </Switch>
      </Router>
    </Provider>
  );
}

export default Composer;
