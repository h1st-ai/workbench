import React from 'react';
import { withKeycloak } from '@react-keycloak/web';

function DashboardContainer({ keycloak }: any) {
  return (
    <React.Fragment>
      <p>Dashboard container</p>
      <p>{JSON.stringify(keycloak)}</p>
    </React.Fragment>
  );
}

export default withKeycloak(DashboardContainer);
