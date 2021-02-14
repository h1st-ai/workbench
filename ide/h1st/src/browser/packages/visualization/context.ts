import * as React from 'react';
import { IVisualizationContext } from './types';

const defaultValue: IVisualizationContext = {
  backendService: undefined,
};

const GraphVisualizationContext = React.createContext(defaultValue);
export const GraphVisualizationContextProvider =
  GraphVisualizationContext.Provider;
export default GraphVisualizationContext;
