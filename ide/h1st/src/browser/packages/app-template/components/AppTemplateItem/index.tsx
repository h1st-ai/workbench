import * as React from 'react';
import { useContext } from 'react';
import AppTemplateContext from '../../context';
import { Icon } from '../Icon';

interface AppTemplateItemsProps {
  name: string;
  icon: string | string[];
  key: string;
  description?: {
    workflow: string;
    stack: string;
  };
  templateName?: string;
  handleOnClone?: Function;
}

const AppTemplateItem = (props: AppTemplateItemsProps) => {
  const { messageService } = useContext(AppTemplateContext);
  const handleOnClick = async () => {
    if (props?.templateName) {
      await props?.handleOnClone?.(props?.templateName);
    }

    messageService?.info?.(
      `${props.name} was cloned sucessfully into you workspace`,
    );
  };
  return (
    <div className="app-template-item" onClick={handleOnClick}>
      <div className="main-content">
        <div className="icon">
          {Array.isArray(props.icon) ? (
            props?.icon?.map(icon => (
              <Icon key={icon} icon={icon as string} width={50} height={50} />
            ))
          ) : (
            <Icon icon={props.icon as string} width={75} height={75} />
          )}
        </div>
        <div className="title">{props.name}</div>
      </div>
      {props?.description && (
        <div className="description">
          <div className="row">
            <div className="name">
              <Icon icon="h1st" />
              <span className="text">Workflow</span>
            </div>
            <div className="description-content">
              {props?.description?.workflow}
            </div>
          </div>
          <div className="row" style={{ marginTop: 8 }}>
            <div className="name">
              <Icon icon="stack" height={20} />
              <span className="text">Stack</span>
            </div>
            <div className="description-content">
              {props?.description?.stack}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { AppTemplateItem };
