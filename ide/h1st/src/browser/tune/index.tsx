import * as React from "react";
import * as ReactDOM from "react-dom";
import { injectable, postConstruct } from "inversify";
// import { BaseWidget, StatefulWidget } from "@theia/core/lib/browser";
// import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { BaseWidget, Message } from "@theia/core/lib/browser";
// import { Disposable } from "@theia/core";

@injectable()
export class ExperimentWidget extends BaseWidget {
  static readonly ID = "h1st:tune:sidebar:widget";
  static readonly LABEL = "Hyper Parameter Tuning";
  protected contentNode: HTMLElement;

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

  // @postConstruct()
  // protected init(): void {
  //   alert("init");
  //   this.id = ExperimentWidget.ID;
  //   this.title.label = ExperimentWidget.LABEL;
  //   this.title.caption = ExperimentWidget.LABEL;
  //   this.title.iconClass = "search-in-workspace-tab-icon";
  //   this.title.closable = true;
  //   this.contentNode = document.createElement("div");
  //   this.contentNode.classList.add("t-siw-search-container");
  //   // this.searchFormContainer = document.createElement('div');
  //   // this.searchFormContainer.classList.add('searchHeader');
  //   // this.contentNode.appendChild(this.searchFormContainer);
  //   // this.node.appendChild(this.contentNode);
  // }

  // protected render(): React.ReactNode {
  //   return <p>Tuning</p>;
  // }

  protected onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);
    ReactDOM.render(
      <React.Fragment>{this.renderList()}</React.Fragment>,
      this.contentNode
    );
    // Widget.attach(this.resultTreeWidget, this.contentNode);
    // this.toDisposeOnDetach.push(
    //   Disposable.create(() => {
    //     Widget.detach(this.resultTreeWidget);
    //   })
    // );
  }

  protected renderList(): React.ReactNode {
    return <div>ExperimentList</div>;
  }
}
