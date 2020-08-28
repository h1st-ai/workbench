import React from 'react';
import { useState, useEffect } from 'react';
import { withKeycloak } from '@react-keycloak/web';

import styles from './style.module.css';

interface IUserProfile {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  attributes?: {
    picture?: string;
  };
}

function ProfilePhoto({ keycloak }: any) {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    async function getProfile() {
      const p = await keycloak.loadUserProfile();
      setProfile(p);

      const test = await fetch('http://localhost/api/test');
      console.log('test', test);
    }

    getProfile();
  }, []);

  if (!profile) {
    return <div className={styles.profilePhoto}>null</div>;
  }

  return <div className={styles.profilePhoto}>{renderProfile(profile)}</div>;
}

function renderProfile(profile: IUserProfile): React.ReactNode {
  const { attributes, firstName, lastName } = profile;

  if (attributes && attributes.picture) {
    return (
      <span>
        <img src={attributes.picture} alt={`${firstName} ${lastName}`} />
      </span>
    );
  }

  if (firstName && lastName) {
    return (
      <span>
        {firstName[0]} {lastName[0]}
      </span>
    );
  }
}

export default withKeycloak(ProfilePhoto);
