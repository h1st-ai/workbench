import { JsonRpcServer } from "@theia/core/lib/common/messaging";
import { IDefaultLayout } from "../common/types";

export const H1stBackendService = Symbol("H1stBackendService");
export const H1ST_BACKEND_PATH = "/services/helloBackend";

export interface H1stBackendService {
  sayHelloTo(name: string): Promise<string>;
  createModelFiles(name: string): Promise<boolean>;
}
export const H1stBackendWithClientService = Symbol("BackendWithClient");
export const H1ST_BACKEND_WITH_CLIENT_PATH = "/services/withClient";

export interface H1stBackendWithClientService
  extends JsonRpcServer<BackendClient> {
  getWorkspaceName(): Promise<string>;
  getWorkspacePath(): Promise<string>;
  getDefaultWorkspaceSettings(): Promise<IDefaultLayout>;
  getConfig(name: string): Promise<string>;
}
export const BackendClient = Symbol("BackendClient");
export interface BackendClient {
  getName(): Promise<string>;
}
