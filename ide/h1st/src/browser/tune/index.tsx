import * as React from "react";
// import * as ReactDOM from "react-dom";
import { injectable, postConstruct } from "inversify";
// import { BaseWidget, StatefulWidget } from "@theia/core/lib/browser";
// import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { Message, ReactWidget } from "@theia/core/lib/browser";
import { Emitter, Event } from "@theia/core";
import TuningContext from "./context";
import { ITuningContext } from "./types";
import { TuningManager } from "./tuning-manager";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import reducer from "./reducers";
import { Provider } from "react-redux";

@injectable()
export class ExperimentListWidget extends ReactWidget {
  static readonly ID = "h1st:tune:sidebar:widget";
  static readonly LABEL = "Hyper Parameter Tuning";

  protected readonly onDidUpdateEmitter = new Emitter<void>();
  readonly onDidUpdate: Event<void> = this.onDidUpdateEmitter.event;
  protected tuningManager: TuningManager;
  protected store: EnhancedStore;

  constructor() {
    super();
    this.store = configureStore({ reducer, devTools: true });
    this.tuningManager = new TuningManager({ store: this.store });
  }

  get manager(): TuningManager {
    return this.tuningManager;
  }

  @postConstruct()
  protected async init(): Promise<void> {
    this.id = ExperimentListWidget.ID;
    this.title.label = ExperimentListWidget.LABEL;
    this.title.caption = ExperimentListWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = "sidebar-tuning-icon";

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

  protected onActivateRequest(msg: Message): void {
    super.onActivateRequest(msg);
    this.node.focus();
  }

  protected renderList(): React.ReactNode {
    const contextValue: ITuningContext = {
      manager: this.tuningManager,
    };

    return (
      <TuningContext.Provider value={contextValue}>
        <Provider store={this.store}>
          <div>ExperimentList</div>
        </Provider>
      </TuningContext.Provider>
    );
  }
}
