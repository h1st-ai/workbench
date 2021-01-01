import { FileNavigatorContribution } from "@theia/navigator/lib/browser/navigator-contribution";
import { inject, injectable } from "inversify";

import { WorkspaceService } from "@theia/workspace/lib/browser";
// import { H1stBackendWithClientService } from "../common/protocol";
// import { FileOperation } from "@theia/filesystem/lib/common/files";
import // FrontendApplication,
// Widget,
// Saveable,
// SaveableWidget,
"@theia/core/lib/browser";
import { EditorManager } from "@theia/editor/lib/browser";
import { H1stTelemetryService } from "./h1st-telemetry-service";
// import { Saveable, setDirty } from "@theia/core/lib/browser";
// import { H1stDeleteLabelProviderContribution } from "./h1st-label-contribution";
// import { WidgetFactory } from "@theia/core/lib/browser";

// import { FileOperation } from "@theia/filesystem/lib/common/files";

@injectable()
export class H1stWorkspaceService extends WorkspaceService {
  // @inject(FrontendApplication) private readonly app: FrontendApplication;
  // @inject(H1stBackendWithClientService)
  // private readonly h1stBackEndWithClientService: H1stBackendWithClientService;
  @inject(EditorManager)
  protected readonly editorManager: EditorManager;
  @inject(FileNavigatorContribution)
  protected readonly fileNavigatorContribution: FileNavigatorContribution;
  @inject(H1stTelemetryService)
  protected readonly telemetryService: H1stTelemetryService;

  constructor() {
    super();
  }

  protected async init(): Promise<void> {
    super.init();

    this.fileService.onDidFilesChange((e) => {
      this.telemetryService.logFileChangedEvent();
      this.fileNavigatorContribution.refreshWorkspace();
    });
  }

  // protected async doGetDefaultWorkspaceUri(): Promise<string | undefined> {
  //   return await this.h1stBackEndWithClientService.getWorkspacePath();
  // }
}
