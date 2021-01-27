import * as React from 'react';
import { DeploymentItem } from './DeploymentItem';
import ServingContext from '../../../../context';

interface DeploymentHistoryTableProps {
  deployments: any;
  getDeployments: Function;
}

const DeploymentHistoryTable = ({
  deployments = [],
  getDeployments,
}: DeploymentHistoryTableProps) => {
  const { backendService, messageService } = React.useContext(ServingContext);

  const removeDeployment = async (id: string) => {
    try {
      console.log('Call remove deployment in ui', { id });
      await backendService?.removeServingDeployment(id);
      messageService?.info('Remove serving sucessfully');
      getDeployments();
    } catch (error) {}
  };
  const stopDeployment = async (classname: string, version: number) => {
    try {
      await backendService?.stopServingDeployment(classname, version);
      messageService?.info('Stop serving sucessfully');
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
