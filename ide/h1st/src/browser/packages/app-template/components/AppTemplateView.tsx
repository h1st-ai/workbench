import * as React from 'react';
import { AppTemplateGroup } from './AppTemplateGroup';

interface IServingProps {}

export const AppTemplateView = (props: IServingProps) => {
  return (
    <div className="app-template-container">
      <AppTemplateGroup
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
          },
          {
            name: 'IoT Cybersecurity',
            icon: 'iot-cybersecurity',
            key: 'iot-cybersecurity',
            description: {
              workflow: 'LSTM, CNN, Boolean Logic, Ensemble',
              stack: 'Android, NodeJS, FastAPI',
            },
          },
        ]}
      />
      <AppTemplateGroup
        title="AI Workflow Examples"
        items={[
          {
            name: 'Image Classification',
            icon: 'image-classification',
            key: 'image-classification',
          },
          {
            name: 'Object Detection',
            icon: 'object-detection',
            key: 'object-detection',
          },
          {
            name: 'ML and Boolean Logic',
            icon: 'ml-boolean-logic',
            key: 'ml-boolean-logic',
          },
          {
            name: 'Fuzzy Logic',
            icon: 'fuzzy-logic',
            key: 'fuzzy-logic',
          },
          {
            name: 'Ensemble',
            icon: 'ensemble',
            key: 'ensemble',
          },

          {
            name: 'Human in the loop',
            icon: 'human-in-the-loop',
            key: 'human-in-the-loop',
          },
        ]}
      />

      <AppTemplateGroup
        title="Tech stacks"
        items={[
          {
            name: 'React & Django',
            icon: ['react', 'django'],
            key: 'react-django',
          },
          {
            name: 'React & FastAPI',
            icon: ['react', 'fast-api'],
            key: 'react-fast-api',
          },
          {
            name: 'Streamlit',
            icon: 'streamlit',
            key: 'streamlit',
          },
        ]}
      />
    </div>
  );
};
