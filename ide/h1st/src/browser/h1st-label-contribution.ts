import { injectable, inject } from "inversify";
import {
  // LabelProviderContribution,
  // LabelProvider,
  DefaultUriLabelProviderContribution,
  DidChangeLabelEvent,
} from "@theia/core/lib/browser";
import URI from "@theia/core/lib/common/uri";
import { Emitter, Event } from "@theia/core";
import { FileService } from "@theia/filesystem/lib/browser/file-service";
// import { FileOperation } from "@theia/filesystem/lib/common/files";

@injectable()
export class H1stDeleteLabelProviderContribution extends DefaultUriLabelProviderContribution {
  @inject(FileService) protected readonly fileService: FileService;
  protected isDeleted: boolean = true;

  constructor() {
    super();
  }

  canHandle(element: URI): number {
    if (element.scheme === "file") {
      return 30;
    }
    return 0;
  }

  fireLabelsDidChange(uri: URI): void {
    this.isDeleted = true;
    this.onDidChangeEmitter.fire({
      affects: (element: URI) => {
        console.log("element.toString()", element.toString(), uri);
        return element.toString() === uri.toString();
      },
    });
  }

  protected getUri(element: URI): URI {
    console.log("get url", element);
    return new URI(element.toString());
  }

  getIcon(element: URI): string {
    console.log("get icon", element);
    const uri = this.getUri(element);
    const icon = super.getFileIcon(uri);
    if (!icon) {
      return this.defaultFileIcon;
    }
    return icon;
  }

  protected readonly onDidChangeEmitter = new Emitter<DidChangeLabelEvent>();

  async getStatus(uri: URI) {
    return await this.fileService.exists(uri);
  }

  getName(element: URI): string | undefined {
    const uri = this.getUri(element);
    console.log("isDeleted", this.isDeleted);

    if (this.isDeleted) {
      this.isDeleted = false;
      return uri.path.base + " (Deleted)";
    }

    return super.getName(uri);
  }

  getLongName(element: URI): string | undefined {
    console.log("get long name", element);
    const uri = this.getUri(element);
    return super.getLongName(uri);
  }

  get onDidChange(): Event<DidChangeLabelEvent> {
    return this.onDidChangeEmitter.event;
  }
}
