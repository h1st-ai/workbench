import { CommandService, MessageService } from '@theia/core';
import { ReactWidget } from '@theia/core/lib/browser';
import { H1stBackendWithClientService } from '../../../common/protocol';

export interface IAppTemplateContext {
  messageService: MessageService | undefined;
  backendService: H1stBackendWithClientService | undefined;
  commandService: CommandService | undefined;
  widget: ReactWidget | undefined;
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

// widget level

export interface IWidgetStore {
  widget: IWidgetExperimentSlice;
}

export interface ISetWidgetLoadingPayload {
  payload: {
    loading: boolean;
  };
}

export interface IWidgetExperimentSlice {
  data: any;
  loading: boolean;
  loaded: boolean;
}
