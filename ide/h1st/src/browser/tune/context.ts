import * as React from 'react';
// import { TuningManager } from './tuning-manager';
import { ITuningContext } from './types';
// import store from './stores';

const defaultValue: ITuningContext = {
  manager: undefined,
};

const TuningContext = React.createContext(defaultValue);
export const TuningContexttProvider = TuningContext.Provider;
export default TuningContext;
