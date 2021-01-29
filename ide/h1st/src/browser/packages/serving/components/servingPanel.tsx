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
    <div>
      ServingPanel
      <button
        onClick={() => {
          console.log('On click');
          commandService.executeCommand(ServingCommands.SERVING.id);
        }}
      >
        Show Panel
      </button>
    </div>
  );
};
