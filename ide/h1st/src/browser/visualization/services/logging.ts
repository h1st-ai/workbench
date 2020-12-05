import { LogLevel } from "@theia/core";

const log = (message: string, ...params: any[]): void =>
  console.log("Visualization", LogLevel.INFO, message, ...params);

export { log };
