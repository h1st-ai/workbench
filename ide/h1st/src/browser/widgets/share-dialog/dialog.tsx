import * as React from 'react';
import { ChangeEvent } from 'react';
import { KeycloakInstance } from 'keycloak-js';
import { Collaborator } from './shareDialog';
import Icon from '../../notebook/components/icon';
import { H1stBackendWithClientService } from '../../../common/protocol';

interface IShareDialogProps {
  keycloak: KeycloakInstance;
  workspaceId: string;
  service: H1stBackendWithClientService;
}

export default function ShareDialogComponent({
  keycloak,
  service,
}: IShareDialogProps) {
  const [collabs, setCollab] = React.useState<any>([]);
  let timeoutId: NodeJS.Timeout;

  const handleTextChange = async (input: ChangeEvent<HTMLInputElement>) => {
    console.log('input', input.target.value);
    input.persist();

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      if (input.target.value.length > 0) {
        const suggested = await service.getCollaborators(
          input.target.value,
          keycloak.token ? keycloak.token : '',
        );

        setCollab(suggested.splice(0, 3));
        // console.log('suggested', collabs);
      } else {
        setCollab([]);
      }
    }, 200);
  };

  const renderCollaboratorInput = () => {
    return (
      <>
        <div>Collaborator</div>
        <input
          onChange={(input: ChangeEvent<HTMLInputElement>) =>
            handleTextChange(input)
          }
        />
        {renderAutoSuggested()}
      </>
    );
  };

  const renderAutoSuggested = () => {
    if (collabs.length > 0) {
      const list = collabs.map((c: any) => (
        <li key={c.id}>
          <strong>{`${c.firstName} ${c.lastName}`}</strong>
          <span>{c.email}</span>
        </li>
      ));

      return <ul>{list}</ul>;
    }
  };

  const renderActionButton = () => {
    return (
      <div className="acction-button-section">
        <button className="action-button primary">Share</button>
        <button className="action-button secondary" onClick={() => close()}>
          Cancel
        </button>
      </div>
    );
  };

  const renderCollaboratorList = () => {
    return (
      <>
        <CollaboratorItem
          avatar="https://merics.org/sites/default/files/styles/ct_team_member_default/public/2020-04/avatar-placeholder.png?itok=Vhm0RCa3"
          name="John Smith"
          email="john@ma.il"
          isOwner={true}
        />
        <CollaboratorItem
          avatar="https://merics.org/sites/default/files/styles/ct_team_member_default/public/2020-04/avatar-placeholder.png?itok=Vhm0RCa3"
          name="Adam Levine"
          email="adam@ma.il"
          isOwner={false}
        />
        <CollaboratorItem
          avatar="https://merics.org/sites/default/files/styles/ct_team_member_default/public/2020-04/avatar-placeholder.png?itok=Vhm0RCa3"
          name="David Jackson"
          email="david@ma.il"
          isOwner={false}
        />
      </>
    );
  };

  return (
    <div className={'share-dialog-content'}>
      {renderCollaboratorInput()}
      {renderCollaboratorList()}
      {renderActionButton()}
    </div>
  );
}

const CollaboratorItem = ({
  avatar,
  name,
  email,
  isOwner = false,
}: Collaborator) => {
  return (
    <div className="collaborator-item">
      <div className="collaborator-info">
        <div className="avatar">
          <img src={avatar} />
        </div>
        <div className="info">
          <div className="name">
            <span>{name}</span>
            {isOwner && <span className="owner">OWNER</span>}
          </div>
          <div className="email">{email}</div>
        </div>
      </div>
      <div className="delete-button">
        <Icon icon="trash-bin" />
      </div>
    </div>
  );
};
