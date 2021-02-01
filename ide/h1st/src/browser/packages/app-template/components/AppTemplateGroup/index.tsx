import * as React from 'react';
import { AppTemplateItem } from '../AppTemplateItem';

interface IAppTemplateGroupProps {
  title: string;
  items: any[];
}

const AppTemplateGroup = (props: IAppTemplateGroupProps) => {
  return (
    <div className="app-template-group">
      <div className="title">{props.title}</div>
      <div className="items">
        {props?.items?.map(item => (
          <div className="item" key={item.key}>
            <AppTemplateItem {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export { AppTemplateGroup };
