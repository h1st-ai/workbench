import { TuningManager } from './tuning-manager';

export interface ITuningContext {
  manager: TuningManager | undefined;
}

export interface IStore {
  tunes: IExperimentSlice;
}

export interface IAddExperimentPayload {
  payload: {
    data: IExperiment[];
  };
}

export interface IExperimentSlice {
  data: IExperiment[];
  loading: boolean;
  loaded: boolean;
}

export interface IExperiment {
  id: string;
  name: string;
  model_class?: string;
  config?: any;
  status?: string;
  error?: string | null;
  traceback?: string;
  created_at?: string;
  finished_at?: string | null;
}
