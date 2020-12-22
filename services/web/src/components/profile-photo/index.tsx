import React from 'react';
import { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';

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

function ProfilePhoto() {
  const [profile, setProfile] = useState({});
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    async function getProfile() {
      const p = await keycloak.loadUserProfile();
      setProfile(p);
    }

    if (initialized) {
      getProfile();
    }
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

export default ProfilePhoto;
