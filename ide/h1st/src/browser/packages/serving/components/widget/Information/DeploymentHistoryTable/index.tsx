import * as React from 'react';
import { MessageService } from '@theia/core';
import { H1stBackendWithClientService } from '../../../../../../../common/protocol';
import { DeploymentItem } from './DeploymentItem';

interface DeploymentHistoryTableProps {
  deployments: any;
  messageService: MessageService;
  getDeployments: Function;
  service: H1stBackendWithClientService;
}

const DeploymentHistoryTable = ({
  deployments = [],
  messageService,
  getDeployments,
  service,
}: DeploymentHistoryTableProps) => {
  const removeDeployment = async (id: string) => {
    try {
      console.log('Call remove deployment in ui', { id });
      await service.removeServingDeployment(id);
      messageService.info('Remove serving sucessfully');
      getDeployments();
    } catch (error) {}
  };
  const stopDeployment = async (classname: string, version: number) => {
    try {
      await service.stopServingDeployment(classname, version);
      messageService.info('Stop serving sucessfully');
      getDeployments();
    } catch (error) {}
  };
  return (
    <div className="deployment-history-table">
      <table cellSpacing={0}>
        <thead>
          <tr>
            <th>Service</th>
            <th>Version</th>
            <th>Deployed by</th>
            <th>Deployed On</th>
            <th>Instances</th>
            <th>Status</th>
            <th style={{ width: '10%' }}></th>
          </tr>
        </thead>
        <tbody>
          {deployments.map((deployment: any, idx: number) => (
            <DeploymentItem
              key={idx}
              {...deployment}
              messageService={messageService}
              removeDeployment={removeDeployment}
              stopDeployment={stopDeployment}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { DeploymentHistoryTable };
