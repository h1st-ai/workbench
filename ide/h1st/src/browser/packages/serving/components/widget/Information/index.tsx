import * as React from 'react';
import { useState } from 'react';
import { CopyIcon } from './Icons/Icons';
import { MessageService } from '@theia/core';
import {
  getExampleServingServiceURL,
  getServingServiceURL,
  removeServingDeployment,
  stopServingDeployment,
} from '../../../services/dataSource';
import { useEffect } from 'react';

const formatDate = (dateSring: string) => {
  const date = new Date(dateSring);

  return date.toLocaleString('default', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};

const copyURL = async (url: string) => {
  const fullUrl = getServingServiceURL(url);
  if (!navigator.clipboard) {
    var textArea = document.createElement('textarea');
    textArea.value = fullUrl;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Unable to copy', err);
    }
    return;
  }
  try {
    await navigator.clipboard.writeText(fullUrl);
  } catch (error) {
    console.error('Async: Could not copy text: ', error);
  }
};

const ServingItem = (props: any) => {
  const [showTry, setShowTry] = useState(false);

  useEffect(() => {
    setShowTry(false);
  }, [props?.id]);

  return (
    <tr className="deployment-row">
      <td>{props?.graph_name}</td>
      <td style={{ textAlign: 'center' }}>v{props?.version}</td>
      <td>{props?.deployed_by ?? ''}</td>
      <td>{formatDate(props?.deployed_at)}</td>
      <td>Local</td>
      <td>{props?.status}</td>
      <td>
        <span className="button-group align-end">
          {/* <button className="serving-table-button serving-table-button__start">
            Start
          </button> */}
          {props?.status === 'deployed' && [
            <button
              key="try"
              className="serving-table-button serving-table-button__try"
              onClick={() => {
                // props?.stopDeployment(props?.graph_name);
                setShowTry(!showTry);
              }}
            >
              {showTry ? 'Hide' : 'Try'}
            </button>,
            <button
              key="stop"
              className="serving-table-button serving-table-button__stop"
              onClick={() => {
                props?.stopDeployment(props?.graph_name, props?.version);
              }}
            >
              Stop
            </button>,
            <button
              key="copy"
              className="serving-table-button serving-table-button__url"
              onClick={async () => {
                await copyURL(props?.url);
                props?.messageService?.info(
                  'URL successfully copied to clipboard',
                );
              }}
            >
              <CopyIcon />
              URL
            </button>,
          ]}

          <button
            className="serving-table-button serving-table-button__remove"
            onClick={() => props?.removeDeployment(props?.id)}
          ></button>
        </span>
        {showTry && (
          <div style={{ width: '100%', marginTop: 8 }}>
            <code>curl {getExampleServingServiceURL(props?.url)}</code>
          </div>
        )}
      </td>
    </tr>
  );
};

interface DeploymentHistoryTableProps {
  deployments: any;
  messageService: MessageService;
  getDeployments: Function;
}

const DeploymentHistoryTable = ({
  deployments = [],
  messageService,
  getDeployments,
}: DeploymentHistoryTableProps) => {
  const removeDeployment = async (id: string) => {
    try {
      await removeServingDeployment(id);
      messageService.info('Remove serving sucessfully');
      getDeployments();
    } catch (error) {}
  };
  const stopDeployment = async (classname: string, version: number) => {
    try {
      await stopServingDeployment(classname, version);
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
            <ServingItem
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
}

const Information = ({
  deployments = [],
  messageService,
  getDeployments,
}: InfomationProps) => {
  return (
    <div className="serving-right serving-information">
      <DeploymentHistoryTable
        deployments={deployments}
        messageService={messageService}
        getDeployments={getDeployments}
      />
      {/* <DeploymentMonitoring /> */}
    </div>
  );
};

export { Information };
