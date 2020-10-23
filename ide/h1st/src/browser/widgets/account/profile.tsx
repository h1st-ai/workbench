import { KeycloakProfile } from "keycloak-js";
import * as React from "react";
// import "./style.css";

interface IUserProfileProps {
  user: KeycloakProfile;
}

function ProfilePhoto({ user }: IUserProfileProps) {
  if (!user) {
    return <div className="profile-photo">null</div>;
  }

  return <div className="profile-photo">{renderProfile(user)}</div>;
}

function renderProfile(profile: KeycloakProfile): React.ReactNode {
  // @ts-ignore
  const { attributes, firstName, lastName } = profile;

  // if (attributes && attributes.picture) {
  //   return (
  //     <span>
  //       <img src={attributes.picture} alt={`${firstName} ${lastName}`} />
  //     </span>
  //   );
  // }

  if (firstName && lastName) {
    return (
      <span>
        {firstName[0]}
        {lastName[0]}
      </span>
    );
  }
}

export default ProfilePhoto;
