import { JsonRpcServer } from '@theia/core/lib/common/messaging';
import { IDefaultLayout, INotebookServerConfig } from '../common/types';

export interface IH1stTuningService extends JsonRpcServer<IBackendClient> {}
export const BackendClient = Symbol('BackendClient');
export interface IBackendClient {
  getName(): Promise<string>;
}

export const H1stBackendService = Symbol('H1stBackendService');
export const H1ST_BACKEND_PATH = '/services/helloBackend';

export interface H1stBackendService {
  createModelFiles(name: string): Promise<boolean>;
}
export const H1stBackendWithClientService = Symbol('BackendWithClient');
export const H1ST_BACKEND_WITH_CLIENT_PATH = '/services/withClient';

export interface H1stBackendWithClientService
  extends JsonRpcServer<IBackendClient> {
  getFileContent(uri: string): Promise<string>;
  getWorkspaceName(): Promise<string>;
  getWorkspacePath(): Promise<string>;
  getDefaultWorkspaceSettings(): Promise<IDefaultLayout>;
  getConfig(name: string): Promise<string>;
  getNotebookServerConfig(): Promise<INotebookServerConfig>;
  getModelList(): Promise<any>;
  getTuneList(): Promise<any>;
  getEnv(): Promise<string>;
  getCollaborators(needle: string, token: string): Promise<any[]>;
}
