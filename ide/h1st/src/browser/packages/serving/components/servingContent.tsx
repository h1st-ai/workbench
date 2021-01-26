import * as React from 'react';
import { DeploymentForm } from './widget/DeploymentForm';
import { Information } from './widget/Information';

export const ServingContent = (props: any) => {
  return (
    <div className="serving">
      <DeploymentForm messageService={props?.messageService} />
      <Information />
    </div>
  );
};
