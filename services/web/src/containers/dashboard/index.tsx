import React from 'react';
import { withKeycloak } from '@react-keycloak/web';
import AppHeader from 'components/app-header';
import styles from './style.module.css';

function DashboardContainer({ keycloak }: any) {
  return (
    <div>
      <AppHeader />
    </div>
  );
}

export default withKeycloak(DashboardContainer);
