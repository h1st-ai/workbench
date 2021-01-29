import * as React from 'react';
import { useState } from 'react';
import { CopyIcon } from '../../Icons/Icons';
import {
  getExampleServingServiceURL,
  getServingServiceURL,
} from '../../../../../services/dataSource';
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

const DeploymentItem = (props: any) => {
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

export { DeploymentItem };
