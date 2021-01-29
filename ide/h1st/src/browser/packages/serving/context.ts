import * as React from 'react';
import { IServingContext } from './types';

const defaultValue: IServingContext = {
  messageService: undefined,
  backendService: undefined,
};

const ServingContext = React.createContext(defaultValue);
export const ServingContexttProvider = ServingContext.Provider;
export default ServingContext;
