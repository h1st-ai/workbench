import * as React from "react";
import { TuningManager } from "./tuning-manager";
import { ITuningContext } from "./types";

const defaultValue: ITuningContext = {
  manager: new TuningManager({ store: null }),
};

const TuningContext = React.createContext(defaultValue);
export const TuningContexttProvider = TuningContext.Provider;
export default TuningContext;
