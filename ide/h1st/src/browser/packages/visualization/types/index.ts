import { H1stBackendWithClientService } from '../../../../common/protocol';
import { IGraph } from './graph';

export interface IVisualizationStore {
  graph: IGraph;
}

export interface IVisualizationContext {
  backendService: H1stBackendWithClientService | undefined;
}

export * from './graph';
