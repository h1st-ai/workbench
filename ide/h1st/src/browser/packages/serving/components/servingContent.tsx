import * as React from 'react';
import { useState, useEffect } from 'react';
import { DeploymentForm } from './widget/DeploymentForm';
import { Information } from './widget/Information';
import { getServingDeployments } from '../services/dataSource';

export const ServingContent = (props: any) => {
  const [deployments, setDeployments] = useState([]);

  const getDeployments = async () => {
    try {
      const deployments = await getServingDeployments();
      setDeployments(deployments);
    } catch (error) {}
  };
  useEffect(() => {
    getDeployments();
  }, []);
  return (
    <div className="serving">
      <DeploymentForm
        messageService={props?.messageService}
        getDeployments={getDeployments}
      />
      <Information
        deployments={deployments}
        messageService={props?.messageService}
        getDeployments={getDeployments}
      />
    </div>
  );
};
