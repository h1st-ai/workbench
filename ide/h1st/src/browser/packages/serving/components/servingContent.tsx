import * as React from 'react';
import { useState, useEffect } from 'react';
import { DeploymentForm } from './widget/DeploymentForm';
import { Information } from './widget/Information';
import { MessageService } from '@theia/core';
import { H1stBackendWithClientService } from '../../../../common/protocol';

interface IServingProps {
  messageService: MessageService;
  service: H1stBackendWithClientService;
}

export const ServingContent = (props: IServingProps) => {
  const [deployments, setDeployments] = useState<any[]>([]);

  const getDeployments = async () => {
    try {
      const deployments = await props?.service.getDeployments();
      setDeployments(deployments as any[]);
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
        service={props.service}
      />
    </div>
  );
};
