import * as React from 'react';
import { SelectBox } from './widget/SelectBox';

const SelectGraphClass = () => {
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
      <div className="row space-between">
        <div className="form-label">Auto-scaling</div>
        <div>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
      <div>
        <SelectBox />
      </div>
      <div>
        <button className="deploy-button" type="button">
          Deploy
        </button>
      </div>
    </div>
  );
};

const DeployForm = () => {
  return (
    <div className="serving-content serving-left">
      <SelectGraphClass />
      <InstanceSize />
    </div>
  );
};

export const ServingContent = () => {
  return (
    <div style={{ height: '100%' }}>
      <DeployForm />
    </div>
  );
};
