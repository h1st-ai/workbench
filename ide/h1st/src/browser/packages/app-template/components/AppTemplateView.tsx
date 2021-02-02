import * as React from 'react';
import { H1stBackendWithClientService } from '../../../../common/protocol';
import { AppTemplateGroup } from './AppTemplateGroup';

interface IServingProps {
  service: H1stBackendWithClientService;
}

export const AppTemplateView = (props: IServingProps) => {
  const handleOnClone = async (url: string) => {
    await props.service.cloneTemplateRepo(url);
  };
  return (
    <div className="app-template-container">
      <AppTemplateGroup
        handleOnClone={handleOnClone}
        title="Usecases"
        items={[
          {
            name: 'Predictive Maintenance',
            icon: 'predictive-maintenance',
            key: 'predictive-maintenance',
            description: {
              workflow: 'CNN, FuzzyLogic, Ensemble',
              stack: 'React, Django',
            },
            templateName: 'pred-maintenance',
          },
          {
            name: 'IoT Cybersecurity',
            icon: 'iot-cybersecurity',
            key: 'iot-cybersecurity',
            description: {
              workflow: 'LSTM, CNN, Boolean Logic, Ensemble',
              stack: 'Android, NodeJS, FastAPI',
            },
            templateName: 'iot-cybersec',
          },
        ]}
      />
      <AppTemplateGroup
        title="AI Workflow Examples"
        handleOnClone={handleOnClone}
        items={[
          {
            name: 'Handwritten Digit Classification',
            icon: 'handwriting',
            key: 'handwriting',
            templateName: 'digit-classification',
          },
          {
            name: 'Handwritten Digit Classification with Feedback',
            icon: 'handwriting',
            key: 'handwriting-feedback',
            templateName: 'digit-classification-feedback',
          },
          {
            name: 'Ensemble',
            icon: 'ensemble',
            key: 'ensemble',
            templateName: 'h1st-ai-ensemble',
          },
          {
            name: 'Fuzzy Logic',
            icon: 'fuzzy-logic',
            key: 'fuzzy-logic',
            templateName: 'h1st-ai-fuzzylogic',
          },

          {
            name: 'Simple 10x Multiplication',
            icon: '10x',
            key: '10x-multiply',
            templateName: 'simple-10x-multiply',
          },
          {
            name: '2-Step AI Workflow',
            icon: '2-step',
            key: 'image-classification',
            templateName: '2-step-workflow',
          },
        ]}
      />

      <AppTemplateGroup
        title="Tech stacks"
        handleOnClone={handleOnClone}
        items={[
          {
            name: 'H1st with React UI',
            icon: 'react',
            key: 'react-django',
            templateName: 'h1st-with-react-ui',
          },
          {
            name: 'H1st with Angular.js UI',
            key: 'h1st-angular',
            templateName: 'h1st-with-angular-ui',
          },
          {
            name: 'Streamlit',
            icon: 'streamlit',
            key: 'streamlit',
          },
        ]}
      />
      <AppTemplateGroup
        title="Light/Quickstart"
        handleOnClone={handleOnClone}
        items={[
          {
            name: 'Quickstart (no UI)',
            icon: 'quick-start',
            key: 'quick-start',
            templateName: 'h1st-ai-base',
          },
        ]}
      />
    </div>
  );
};
