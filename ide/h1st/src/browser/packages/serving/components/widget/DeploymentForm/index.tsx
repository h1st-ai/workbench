import * as React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { SelectBox } from '../SelectBox';
import { MessageService } from '@theia/core';

const SelectGraphClass = (props: any) => {
  const [graphClasses, setGraphClasses] = useState([]);
  const { graphClass, setGraphClass } = props;

  const getGraphClass = async () => {
    // const res = await fetch('http://localhost:3000/api/deployments/classes');
    // const data = await res.json();
    const res = await axios.get(
      'http://localhost:3000/api/deployments/classes',
    );

    const data = res.data?.data ?? [];

    setGraphClasses(data);
    setGraphClass(data?.[0]);
  };

  useEffect(() => {
    getGraphClass();
  }, []);
  return (
    <div className="form-section">
      <div className="section-title">Class</div>
      <div>
        <select
          value={graphClass}
          className="serving-input-select"
          onChange={val => {
            console.log('change val', val);
            setGraphClass(val);
          }}
        >
          {graphClasses.map(klass => (
            <option key={klass} className="form-label">
              {klass}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const InstanceSize = () => {
  return (
    <div className="form-section">
      <div className="section-title">Instance Size</div>
      {/* <div className="row space-between">
        <div className="form-label">Auto-scaling</div>
        <div>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>
      </div> */}
      <div>
        <SelectBox />
      </div>
      {/* <div className="section-title">Replicas</div>
      <div className="row">
        <input
          className="replicas-input"
          type="number"
          min={1}
          max={3}
          defaultValue={1}
        />{' '}
        <span className="replicas-input-label">Medium instances</span>
      </div> */}
    </div>
  );
};

const DeployButton = ({ onDeploy }: { onDeploy: Function }) => {
  return (
    <div>
      <button
        className="deploy-button"
        type="button"
        onClick={() => onDeploy()}
      >
        Deploy
      </button>
    </div>
  );
};

interface DeploymentFormProps {
  messageService: MessageService;
  getDeployments: Function;
}

const DeploymentForm = (props: DeploymentFormProps) => {
  const [graphClass, setGraphClass] = useState(null);

  const onDeploy = async () => {
    const res = await axios.post('http://localhost:3000/api/deployments', {
      service_class_name: graphClass,
    });

    props?.messageService?.info?.(
      `Deploy successfully, \n API endpoint: ${res.data?.url}`,
    );
    props?.getDeployments?.();
  };

  return (
    <div className="serving-content serving-left">
      <SelectGraphClass graphClass={graphClass} setGraphClass={setGraphClass} />
      <InstanceSize />
      <DeployButton onDeploy={onDeploy} />
    </div>
  );
};

export { DeploymentForm };
