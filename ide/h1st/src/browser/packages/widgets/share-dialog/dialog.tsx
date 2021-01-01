import * as React from 'react';
import { ChangeEvent } from 'react';
import { KeycloakInstance } from 'keycloak-js';
import { Collaborator } from './shareDialog';
import Icon from '../../notebook/components/icon';
import { H1stBackendWithClientService } from '../../../../common/protocol';
import { CommandService, MessageService } from '@theia/core';
import { H1stCloseShareCommand } from '../../../commands';

interface IShareDialogProps {
  keycloak: KeycloakInstance;
  workspaceId: string;
  service: H1stBackendWithClientService;
  commands: CommandService;
  messageService: MessageService;
}

export interface IShareItem {
  owner_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  user_id: string;
  workbench_id: string;
  permission: string | null;
}

export default function ShareDialogComponent({
  keycloak,
  service,
  messageService,
  workspaceId,
  commands,
}: IShareDialogProps) {
  // list of collaborator
  const [collabs, setCollab] = React.useState<any>({});

  // auto completed list
  const [shares, setShares] = React.useState<any>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  let timeoutId: NodeJS.Timeout;

  React.useEffect(() => {
    (async function() {
      const res = await fetch(`/api/project/${workspaceId}/shares`, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`,
        },
      });

      const data = await res.json();
      console.log('res', data);

      if (data.items) {
        data.items.map((share: IShareItem) => {
          collabs[share.user_id] = share;
        });

        setCollab(collabs);
      }

      setLoading(false);
    })();
  }, []);

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

        setShares(suggested.splice(0, 3));
        // console.log('suggested', collabs);
      } else {
        setShares([]);
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

  const addShare = (share: any) => {
    addNewShare(share, 'read-write');
  };

  const removeShare = (share: any) => {
    console.log('removing share', share);
    addNewShare(share, null);
  };

  const addNewShare = (share: any, permission: string | null = null) => {
    collabs[share.user_id] = {
      ...share,
      workbench_id: workspaceId,
      permission,
    };

    setCollab({ ...collabs });
  };

  const close = () => {
    commands.executeCommand(H1stCloseShareCommand.id);
  };

  const save = async () => {
    const res = await fetch(`/api/project/${workspaceId}/shares`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${keycloak.token}`,
      },
      body: JSON.stringify(Object.keys(collabs).map(key => collabs[key])),
    });

    const data = await res.json();
    console.log('res', data);

    if (data.success) {
      messageService.info('Project sucessfully shared');
      close();
    } else {
      messageService.info('Error sharing project. Please try again');
    }
  };

  const renderAutoSuggested = () => {
    if (shares.length > 0) {
      const list = shares.map((c: any) => (
        <li
          key={c.id}
          onClick={() => {
            addShare({
              ...c,
              first_name: c.firstName,
              last_name: c.lastName,
              user_id: c.email,
            });
            setShares([]);
          }}
        >
          <strong>{`${c.firstName} ${c.lastName}`}</strong>
          <span>{c.email}</span>
        </li>
      ));

      return <ul>{list}</ul>;
    }
  };

  // const renderSuccess = () => {
  //   <div>
  //     <p>Project has been suce</p>
  //     <div className="acction-button-section">
  //       <button className="action-button primary" onClick={() => close()}>
  //         OK
  //       </button>
  //     </div>
  //   </div>
  // }

  const renderActionButton = () => {
    return (
      <div className="acction-button-section">
        <button className="action-button primary" onClick={save}>
          Share
        </button>
        <button className="action-button secondary" onClick={() => close()}>
          Cancel
        </button>
      </div>
    );
  };

  const renderCollaboratorList = () => {
    console.log('shares', collabs);

    return Object.keys(collabs).map((key: string) => {
      console.log('rendering', collabs[key]);
      const share: IShareItem = collabs[key];

      if (!share.permission) {
        console.log('not rendering', key);
        return null;
      }

      return (
        <CollaboratorItem
          avatar="https://merics.org/sites/default/files/styles/ct_team_member_default/public/2020-04/avatar-placeholder.png?itok=Vhm0RCa3"
          name={`${share.first_name} ${share.last_name}`}
          email={share.user_id}
          isOwner={share.user_id === share.owner_id}
          deleteShare={removeShare}
          data={share}
        />
      );
    });
  };

  if (!loading) {
    return (
      <div className={'share-dialog-content'}>
        {renderCollaboratorInput()}
        {renderCollaboratorList()}
        {renderActionButton()}
        {/* {renderSuccess()} */}
      </div>
    );
  }

  return <p>Loading...</p>;
}

const CollaboratorItem = ({
  avatar,
  name,
  email,
  isOwner = false,
  deleteShare,
  data,
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
      <button onClick={() => deleteShare(data)} className="delete-button">
        <Icon icon="trash-bin" />
      </button>
    </div>
  );
};
