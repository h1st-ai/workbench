import * as React from 'react';
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
  getDeployments: Function;
}

const Information = ({ deployments = [], getDeployments }: InfomationProps) => {
  return (
    <div className="serving-right serving-information">
      <DeploymentHistoryTable
        deployments={deployments}
        getDeployments={getDeployments}
      />
      {/* <DeploymentMonitoring /> */}
    </div>
  );
};

export { Information };
