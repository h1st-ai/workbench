const fs = require("fs");

import { injectable } from "inversify";
import { H1stBackendService } from "../common/protocol";

import modelTemplate from "../common/templates/models";
import notebookTemplate from "../common/templates/notebook";

@injectable()
export class H1stBackendServiceImpl implements H1stBackendService {
  sayHelloTo(name: string): Promise<string> {
    return new Promise<string>((resolve) => resolve("Hello " + name));
  }
  async createModelFiles(name: string): Promise<boolean> {
    const modelPromise = await FileHandler.createModelFile(name);
    const notebookPromise = await FileHandler.createNotebookFile(name);

    if (notebookPromise === "success" && modelPromise === "success") {
      return true;
    }

    return false;
  }
}

class FileHandler {
  static createModelFile(name: string): Promise<string> {
    const WORKSPACE_PATH = process.env.WORKSPACE_PATH || "/home/project";
    const WORKBENCH_NAME = process.env.WORKBENCH_NAME || "";
    const modelPath = `${WORKSPACE_PATH}/${WORKBENCH_NAME}/models/${name}.py`;

    return new Promise((resolve, reject) => {
      fs.writeFile(modelPath, modelTemplate(WORKBENCH_NAME, name), function(
        err: any
      ) {
        if (err) {
          return reject(err);
        }

        resolve("success");
      });
    });
  }

  static createNotebookFile(name: string): Promise<string> {
    const WORKSPACE_PATH = process.env.WORKSPACE_PATH || "/home/project";
    const WORKBENCH_NAME = process.env.WORKBENCH_NAME || "SampleProject";
    const notebookPath = `${WORKSPACE_PATH}/${WORKBENCH_NAME}/notebooks/${name}.ipynb`;

    return new Promise((resolve, reject) => {
      fs.writeFile(
        notebookPath,
        notebookTemplate(WORKBENCH_NAME, name),
        function(err: any) {
          if (err) {
            return reject(err);
          }

          resolve("success");
        }
      );
    });
  }
}
