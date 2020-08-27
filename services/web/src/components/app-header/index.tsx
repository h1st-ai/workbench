import React from 'react';
import { withKeycloak } from '@react-keycloak/web';

import Logo from './logo';
import ProfilePhoto from 'components/profile-photo';
import styles from './style.module.css';

function AppHeader() {
  return (
    <header className={styles.appHeader}>
      <Logo />
      <ProfilePhoto />
    </header>
  );
}

export default AppHeader;
