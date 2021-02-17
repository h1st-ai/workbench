import * as React from 'react';
import { IAppTemplateContext } from './types';

const defaultValue: IAppTemplateContext = {
  messageService: undefined,
  backendService: undefined,
  commandService: undefined,
  widget: undefined,
};

const AppTemplateContext = React.createContext(defaultValue);
export const AppTemplateContextProvider = AppTemplateContext.Provider;
export default AppTemplateContext;
