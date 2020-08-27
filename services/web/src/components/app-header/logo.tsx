import React from 'react';
import { Link } from 'react-router-dom';

import styles from './style.module.css';

function Logo({ keycloak }: any) {
  return (
    <h1 className={styles.logo}>
      <Link to="/">
        <svg
          width="40"
          height="29"
          viewBox="0 0 40 29"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M20.0595 0C27.1753 0 31.6487 5.73502 31.6487 5.73502L40 14.0826L31.6524 22.4302C31.6524 22.4302 27.1827 28.1652 20.0633 28.1652C12.9438 28.1652 8.3476 22.4302 8.3476 22.4302L0 14.0826L8.3476 5.73502C8.3476 5.73502 12.9438 0 20.0595 0ZM30.0223 14.0826C30.0223 19.6178 25.5351 24.1049 20 24.1049C14.4648 24.1049 9.97764 19.6178 9.97764 14.0826C9.97764 8.54743 14.4648 4.06028 20 4.06028C25.5351 4.06028 30.0223 8.54743 30.0223 14.0826Z"
          />
          <path d="M21.0495 8.58203V13.1633H18.9467V11.7789H16.8515C16.8515 11.7789 18.9467 10.5247 18.9467 8.58203H14.2277V19.5831H18.9467V15.6866H21.0495V19.5831H25.7685V8.58203H21.0495Z" />
        </svg>

        <span>H1st Workbench</span>
      </Link>
    </h1>
  );
}

export default Logo;
