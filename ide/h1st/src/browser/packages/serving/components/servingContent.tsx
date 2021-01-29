import * as React from 'react';
import { useState, useEffect } from 'react';
import { DeploymentForm } from './widget/DeploymentForm';
import { Information } from './widget/Information';
import { useContext } from 'react';
import ServingContext from '../context';

interface IServingProps {}

export const ServingContent = (props: IServingProps) => {
  const { backendService } = useContext(ServingContext);
  const [deployments, setDeployments] = useState<any[]>([]);

  const getDeployments = async () => {
    try {
      const deployments = await backendService?.getDeployments();
      setDeployments(deployments as any[]);
    } catch (error) {}
  };
  useEffect(() => {
    getDeployments();
  }, []);
  return (
    <div className="serving">
      <DeploymentForm getDeployments={getDeployments} />
      <Information deployments={deployments} getDeployments={getDeployments} />
    </div>
  );
};
