import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DeploymentForm } from './widget/DeploymentForm';
import { Information } from './widget/Information';

export const ServingContent = (props: any) => {
  const [deployments, setDeployments] = useState([]);

  const getDeployments = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/deployments');
      setDeployments(res.data);
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
