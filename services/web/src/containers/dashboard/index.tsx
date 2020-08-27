import React from 'react';
import { withKeycloak } from '@react-keycloak/web';
import AppHeader from 'components/app-header';
import Toolbar from './toolbar';
import styles from './style.module.css';

function DashboardContainer({ keycloak }: any) {
  return (
    <div>
      <AppHeader />
      <div className={styles.container}>
        <Toolbar />
      </div>
    </div>
  );
}

export default withKeycloak(DashboardContainer);
