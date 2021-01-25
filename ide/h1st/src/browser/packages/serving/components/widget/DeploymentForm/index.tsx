import * as React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { SelectBox } from '../SelectBox';

const SelectGraphClass = (props: any) => {
  const { graphClass, setGraphClass } = props;

  useEffect(() => {
    console.log(graphClass);
  }, []);
  return (
    <div className="form-section">
      <div className="section-title">Class</div>
      <div>
        <select className="serving-input-select">
          <option className="form-label">graph class</option>
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
      <div className="section-title">Replicas</div>
      <div className="row">
        <input
          className="replicas-input"
          type="number"
          min={1}
          max={3}
          defaultValue={1}
        />{' '}
        <span className="replicas-input-label">Medium instances</span>
      </div>
    </div>
  );
};

const DeployButton = () => {
  return (
    <div>
      <button className="deploy-button" type="button">
        Deploy
      </button>
    </div>
  );
};

const DeploymentForm = () => {
  const [graphClass, setGraphClass] = useState(null);

  return (
    <div className="serving-content serving-left">
      <SelectGraphClass graphClass={graphClass} setGraphClass={setGraphClass} />
      <InstanceSize />
      <DeployButton />
    </div>
  );
};

export { DeploymentForm };
