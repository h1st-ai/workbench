import * as React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { SelectBox } from '../SelectBox';
import { useContext } from 'react';
import ServingContext from '../../../context';

const SelectGraphClass = (props: any) => {
  const [graphClasses, setGraphClasses] = useState([]);
  const { graphClass, setGraphClass } = props;

  const getGraphClass = async () => {
    const response = await props?.backendService?.getServiceClasses?.();

    const data = response?.data ?? [];

    setGraphClasses(data);
    setGraphClass(data?.[0]);
  };

  useEffect(() => {
    getGraphClass();
  }, []);
  return (
    <div className="form-section">
      <div className="section-title">Service Class</div>
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
  getDeployments: Function;
}

const DeploymentForm = (props: DeploymentFormProps) => {
  const { messageService, backendService } = useContext(ServingContext);
  const [graphClass, setGraphClass] = useState('');

  const onDeploy = async () => {
    const res = await backendService?.createDeployment(graphClass);
    messageService?.info?.(
      `Deploy successfully, \n API endpoint: ${res?.data?.url}`,
    );
    props?.getDeployments?.();
  };

  return (
    <div className="serving-content serving-left">
      <SelectGraphClass
        graphClass={graphClass}
        setGraphClass={setGraphClass}
        backendService={backendService}
      />
      <InstanceSize />
      <DeployButton onDeploy={onDeploy} />
    </div>
  );
};

export { DeploymentForm };
