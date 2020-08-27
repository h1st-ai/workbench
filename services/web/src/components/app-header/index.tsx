import React, { useState } from 'react';
import { withKeycloak } from '@react-keycloak/web';

import Logo from './logo';
import Icon from 'components/icon';
import ProfilePhoto from 'components/profile-photo';
import styles from './style.module.css';

function AppHeader({ keycloak }: any) {
  const [menustate, setMenuState] = useState(false);
  return (
    <header className={styles.appHeader}>
      <Logo />
      <span className={styles.title}>H1st projects</span>
      <div className={styles.userMenu}>
        <a onClick={() => setMenuState(!menustate)}>
          <ProfilePhoto />
          {renderMenu(menustate, keycloak)}
        </a>
      </div>
    </header>
  );
}

function renderMenu(menuOpenned: Boolean, keycloak: any) {
  if (menuOpenned) {
    return (
      <ul>
        {/* <li>
          <a href={keycloak.createLogoutUrl()}>
            <Icon icon="user" />
            Account
          </a>
        </li>
        <li>
          <a href={keycloak.createLogoutUrl()}>
            <Icon icon="gear" />
            Settings
          </a>
        </li> */}
        <li>
          <a href={keycloak.createLogoutUrl()}>
            <Icon icon="logout" />
            Log out
          </a>
        </li>
      </ul>
    );
  }
}

export default withKeycloak(AppHeader);
