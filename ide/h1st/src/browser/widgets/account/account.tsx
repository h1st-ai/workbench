import * as React from "react";
import { KeycloakInstance, KeycloakProfile } from "keycloak-js";
import ProfilePhoto from "./profile";
import { CommandService } from "@theia/core";
import { H1stOpenShareCommand } from "../../commands";
import Icon from "../../notebook/components/icon";

const ShareButton = ({ commands }: { commands: CommandService }) => {
  const handleClickShare = () => {
    // theia
    commands.executeCommand(H1stOpenShareCommand.id);
  };
  return (
    <div className="share-button" onClick={handleClickShare}>
      <Icon icon="user-group" />
      <span className="text">Share</span>
    </div>
  );
};

interface IAccountProps {
  keycloak: KeycloakInstance;
  commands: CommandService;
}

export function Account({ keycloak, commands }: IAccountProps) {
  const [user, setUser] = React.useState<KeycloakProfile>();

  React.useEffect(() => {
    console.log("inject commans", commands);
    (async function() {
      const user = await keycloak.loadUserProfile();
      console.log("user profile", user);

      setUser(user);
    })();
  }, []);

  return (
    <div className="profile-wrapper">
      <a href="/">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.94975 2.00002L2 6.94977L6.94975 11.8995"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.94975 2.00002L2 6.94977L6.94975 11.8995"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="4"
            y1="7"
            x2="12"
            y2="7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="4"
            y1="7"
            x2="12"
            y2="7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Dashboard
      </a>
      <ShareButton commands={commands} />
      <div className="profile-photo-wrapper">
        {user && <ProfilePhoto user={user} />}
      </div>
    </div>
  );
}
