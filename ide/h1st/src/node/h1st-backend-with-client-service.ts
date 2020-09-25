import { injectable } from "inversify";
import { IDefaultLayout } from "../common/types";
import {
  BackendClient,
  H1stBackendWithClientService,
} from "../common/protocol";

const { readdirSync, statSync } = require("fs");
const { join } = require("path");

@injectable()
export class H1stBackendWithClientServiceImpl
  implements H1stBackendWithClientService {
  private client?: BackendClient;

  getWorkspaceName(): Promise<string> {
    return new Promise<string>((resolve, reject) =>
      this.client
        ? this.client.getName().then(() => {
            const { WORKSPACE_PATH, WORKBENCH_NAME } = process.env;
            const dirs: string[] = readdirSync(WORKSPACE_PATH).filter(
              (f: string) => {
                const file = statSync(join(WORKSPACE_PATH, f));
                return file.isDirectory();
              }
            );

            if (dirs.length > 0) {
              resolve(dirs[0]);
            } else {
              resolve(WORKBENCH_NAME);
            }
          })
        : reject("No Client")
    );
  }

  getWorkspacePath(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.client
        ? this.client.getName().then(() => {
            resolve(this.doGetProjectPath());
          })
        : reject("No Client");
    });
  }

  getConfig(name: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.client
        ? this.client.getName().then(() => {
            resolve(process.env[name]);
          })
        : reject("No Client");
    });
  }

  getDefaultWorkspaceSettings(): Promise<IDefaultLayout> {
    const root = this.doGetProjectPath();

    const pythonFiles: string[] = readdirSync(join(root, "models")).filter(
      (f: string) => {
        const file = statSync(join(root, "models", f));

        if (
          file.isFile() &&
          f.substring(-3) === ".py" &&
          f.substr(0, 2) !== "__"
        )
          return true;
      }
    );

    const notebooks: string[] = readdirSync(join(root, "notebooks")).filter(
      (f: string) => {
        const file = statSync(join(root, "notebooks", f));

        if (file.isFile() && f.substring(-6) === ".ipynb") return true;
      }
    );

    console.log(notebooks, pythonFiles);

    const result = {
      files: [
        {
          uri: pythonFiles[0],
          displayInfo: { area: "bottom", view: "split-bottom" },
        },
        { uri: notebooks[0], displayInfo: { area: "main" } },
      ],
    };

    return new Promise<IDefaultLayout>((resolve, reject) => {
      this.client
        ? this.client.getName().then(() => {
            resolve(result);
          })
        : reject("No Client");
    });
  }

  dispose(): void {
    // do nothing
  }
  setClient(client: BackendClient): void {
    this.client = client;
  }

  private doGetProjectPath(): string {
    const { WORKSPACE_PATH, WORKBENCH_NAME } = process.env;

    const dirs: string[] = readdirSync(WORKSPACE_PATH).filter((f: string) =>
      statSync(join(WORKSPACE_PATH, f)).isDirectory()
    );

    console.log("pre filtered dir", dirs);

    if (dirs.length > 0) {
      console.log("default space ", `${WORKSPACE_PATH}/${dirs[0]}`);
      return `${WORKSPACE_PATH}/${dirs[0]}`;
    }

    return `${WORKSPACE_PATH}/${WORKBENCH_NAME}`;
  }
}
