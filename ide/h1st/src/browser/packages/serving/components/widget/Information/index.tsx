import * as React from 'react';
import { CopyIcon } from './Icons/Icons';

const ServingItem = () => {
  return (
    <tr className="deployment-row">
      <td>serve_1</td>
      <td>graphClassName</td>
      <td>David Gil</td>
      <td>Dec 20, 2020</td>
      <td>Large</td>
      <td>Active</td>
      <td>
        <span className="button-group">
          <button className="serving-table-button serving-table-button__start">
            Start
          </button>
          <button className="serving-table-button serving-table-button__stop">
            Stop
          </button>
          <button className="serving-table-button serving-table-button__url">
            <CopyIcon />
            URL
          </button>
          <button className="serving-table-button serving-table-button__remove"></button>
        </span>
      </td>
    </tr>
  );
};

const DeploymentHistoryTable = () => {
  return (
    <div className="deployment-history-table">
      <table cellSpacing={0}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Graph</th>
            <th>Deployed by</th>
            <th>Deployed On</th>
            <th>Instances</th>
            <th>Status</th>
            <th style={{ width: '10%' }}></th>
          </tr>
        </thead>
        <tbody>
          {Array(6)
            .fill({})
            .map((_, idx) => (
              <ServingItem key={idx} />
            ))}
        </tbody>
      </table>
    </div>
  );
};

const DeploymentMonitoringItem = (props: any) => {
  const { title = 'Total predictions', number = 10 } = props;
  return (
    <div className="item">
      <div className="title">{title} </div>
      <div className="number">{number} </div>
    </div>
  );
};

const DeploymentMonitoring = () => {
  return (
    <div className="deployment-monitoring">
      <DeploymentMonitoringItem />
      <DeploymentMonitoringItem />
      <DeploymentMonitoringItem />
      <DeploymentMonitoringItem />
      <DeploymentMonitoringItem />
      <DeploymentMonitoringItem />
    </div>
  );
};

const Information = () => {
  return (
    <div className="serving-right serving-information">
      <DeploymentHistoryTable />
      <DeploymentMonitoring />
    </div>
  );
};

export { Information };
