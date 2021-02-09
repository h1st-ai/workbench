import * as React from 'react';
import { CommandService } from '@theia/core';
import { ServingCommands } from '../contribution';
import { ServingManager } from '../serving-manager';

interface IServingPanel {
  commandService: CommandService;
  manager: ServingManager;
}

export const ServingPanel = ({ commandService }: IServingPanel) => {
  return (
    <div style={{ padding: 8 }}>
      <button
        onClick={() => {
          commandService.executeCommand(ServingCommands.SERVING.id);
        }}
        style={{
          width: '100%',
          outline: 'none',
          border: 'none',
          color: 'white',
          backgroundColor: '#30479B',
          padding: 8,
        }}
      >
        Show Serving Panel
      </button>
    </div>
  );
};
