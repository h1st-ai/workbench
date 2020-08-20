import React from 'react';
import { KeycloakProvider } from '@react-keycloak/web'
import keycloak from './auth';

import './app.css';
import DashboardController from './containers/dashboard'

function App() {
  return (
    <KeycloakProvider keycloak={keycloak}>
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        H1st Workbench Planceholder
        <DashboardController />
      </header>
    </div>
    </KeycloakProvider> 
  );
}

export default App;
