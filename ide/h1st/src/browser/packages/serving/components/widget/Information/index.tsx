import * as React from 'react';
import axios from 'axios';
import classnames from 'classnames';
import { CopyIcon } from './Icons/Icons';
import { useEffect } from 'react';
import { useState } from 'react';

const ServingItem = (props: any) => {
  return (
    <tr className="deployment-row">
      <td>serve_1</td>
      <td>{props?.graphName}</td>
      <td>David Gil</td>
      <td>{props?.deployed_at}</td>
      <td>Local</td>
      <td>{props?.status}</td>
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
  const [deployments, setDeployments] = useState([]);

  const getDeployments = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/deployments');
      setDeployments(res.data);
    } catch (error) {}
  };
  useEffect(() => {
    getDeployments();
  }, []);
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
          {deployments.map((deployment, idx) => (
            <ServingItem key={idx} {...deployment} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DeploymentMonitoringItem = (props: any) => {
  const { title = 'Total predictions', number = 10, error } = props;
  return (
    <div className="item">
      <div className="title">{title} </div>
      <div className={classnames(['number', { error }])}>{number} </div>
    </div>
  );
};

const DeploymentMonitoring = () => {
  return (
    <div className="deployment-monitoring">
      <DeploymentMonitoringItem />
      <DeploymentMonitoringItem title="Total requests" />
      <DeploymentMonitoringItem title="Request over xxx ms" />
      <DeploymentMonitoringItem title="Median | peak load" />
      <DeploymentMonitoringItem
        title="Data Error Rate"
        error={true}
        number={2}
      />
      <DeploymentMonitoringItem
        title="System Error Rate"
        error={true}
        number={4}
      />
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
