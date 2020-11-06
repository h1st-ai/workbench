import * as React from "react";
// import * as ReactDOM from "react-dom";
import { injectable, postConstruct } from "inversify";
// import { BaseWidget, StatefulWidget } from "@theia/core/lib/browser";
// import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { Message, ReactWidget } from "@theia/core/lib/browser";
import { Emitter, Event } from "@theia/core";
// import { Disposable } from "@theia/core";

@injectable()
export class ExperimentWidget extends ReactWidget {
  static readonly ID = "h1st:tune:sidebar:widget";
  static readonly LABEL = "Hyper Parameter Tuning";
  protected contentNode: HTMLElement;

  protected readonly onDidUpdateEmitter = new Emitter<void>();
  readonly onDidUpdate: Event<void> = this.onDidUpdateEmitter.event;

  constructor() {
    super();
  }

  @postConstruct()
  protected async init(): Promise<void> {
    this.id = ExperimentWidget.ID;
    this.title.label = ExperimentWidget.LABEL;
    this.title.caption = ExperimentWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = "sidebar-tuning-icon";

    this.contentNode = document.createElement("div");

    this.update();
  }

  protected onUpdateRequest(msg: Message): void {
    super.onUpdateRequest(msg);
    this.onDidUpdateEmitter.fire(undefined);
  }

  protected render(): React.ReactNode {
    return <p>Tuning</p>;
  }

  protected onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);
    // ReactDOM.render(
    //   <React.Fragment>{this.renderList()}</React.Fragment>,
    //   this.contentNode
    // );
    // Widget.attach(this.resultTreeWidget, this.contentNode);
    // this.toDisposeOnDetach.push(
    //   Disposable.create(() => {
    //     Widget.detach(this.resultTreeWidget);
    //   })
    // );
    this.update();
  }

  protected renderList(): React.ReactNode {
    return <div>ExperimentList</div>;
  }
}
