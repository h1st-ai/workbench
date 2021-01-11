import * as React from 'react';
import { DeploymentForm } from './widget/DeploymentForm';
import { Information } from './widget/Information';

export const ServingContent = () => {
  return (
    <div className="serving">
      <DeploymentForm />
      <Information />
    </div>
  );
};
