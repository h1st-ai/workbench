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
      <div className={styles.title}>
        <span className={styles.projectIcon}>
        <svg  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.91 6.95299L12.7 1.67199C12.4811 1.55895 12.2383 1.49997 11.992 1.49997C11.7456 1.49997 11.5029 1.55895 11.284 1.67199L1.07597 6.95299C0.97541 7.00467 0.891043 7.08306 0.832137 7.17956C0.773231 7.27606 0.742065 7.38693 0.742065 7.49999C0.742065 7.61305 0.773231 7.72392 0.832137 7.82042C0.891043 7.91692 0.97541 7.99531 1.07597 8.04699L11.285 13.328C11.5039 13.441 11.7466 13.5 11.993 13.5C12.2393 13.5 12.4821 13.441 12.701 13.328L22.91 8.04699C23.0102 7.99506 23.0943 7.91658 23.153 7.82011C23.2117 7.72364 23.2427 7.6129 23.2427 7.49999C23.2427 7.38708 23.2117 7.27634 23.153 7.17987C23.0943 7.0834 23.0102 7.00492 22.91 6.95299V6.95299Z" stroke="#6D83D2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M0.758057 12.75L11.2851 17.828C11.5039 17.941 11.7467 18 11.9931 18C12.2394 18 12.4822 17.941 12.7011 17.828L23.2581 12.75" stroke="#6D83D2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M0.758057 17.25L11.2851 22.328C11.5039 22.441 11.7467 22.5 11.9931 22.5C12.2394 22.5 12.4822 22.441 12.7011 22.328L23.2581 17.25" stroke="#6D83D2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

        </span>
        Projects
        </div>
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
