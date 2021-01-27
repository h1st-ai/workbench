import * as React from 'react';
import { MessageService } from '@theia/core';
import { H1stBackendWithClientService } from '../../../../../../common/protocol';
import { DeploymentHistoryTable } from './DeploymentHistoryTable';

// const DeploymentMonitoringItem = (props: any) => {
//   const { title = 'Total predictions', number = 10, error } = props;
//   return (
//     <div className="item">
//       <div className="title">{title} </div>
//       <div className={classnames(['number', { error }])}>{number} </div>
//     </div>
//   );
// };

// const DeploymentMonitoring = () => {
//   return (
//     <div className="deployment-monitoring">
//       <DeploymentMonitoringItem />
//       <DeploymentMonitoringItem title="Total requests" />
//       <DeploymentMonitoringItem title="Request over xxx ms" />
//       <DeploymentMonitoringItem title="Median | peak load" />
//       <DeploymentMonitoringItem
//         title="Data Error Rate"
//         error={true}
//         number={2}
//       />
//       <DeploymentMonitoringItem
//         title="System Error Rate"
//         error={true}
//         number={4}
//       />
//     </div>
//   );
// };

interface InfomationProps {
  deployments: any[];
  messageService: MessageService;
  getDeployments: Function;
  service: H1stBackendWithClientService;
}

const Information = ({
  deployments = [],
  messageService,
  getDeployments,
  service,
}: InfomationProps) => {
  return (
    <div className="serving-right serving-information">
      <DeploymentHistoryTable
        deployments={deployments}
        messageService={messageService}
        getDeployments={getDeployments}
        service={service}
      />
      {/* <DeploymentMonitoring /> */}
    </div>
  );
};

export { Information };
