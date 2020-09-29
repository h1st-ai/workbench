import * as React from "react";
import Icon from "../icon";
import { useSelector } from "react-redux";
import { IStore } from "../../types";
import NotebookContext from "../../context";

export default function Toolbar() {
  const { currentKernel, connectionStatus } = useSelector(
    (store: IStore) => store.kernel
  );

  const context = React.useContext(NotebookContext);

  function renderKernelInfo() {
    if (currentKernel) {
      return (
        <div className="kernel-info-wrapper">
          <span>Kernel: {currentKernel.display_name}</span> |{" "}
          <span>Status: {connectionStatus}</span>
        </div>
      );
    }
  }

  const doRestartKernel = async (ev: any) => {
    await context.manager?.restartKernel();
  };

  return (
    <div className="toolbar">
      <ul>
        <li>
          <button>
            <Icon width={16} height={16} icon="fast-forward" />
          </button>
        </li>
        <li>
          <button>
            <Icon width={16} height={16} icon="play-down" />
          </button>
        </li>

        <li>
          <button onClick={doRestartKernel}>
            <Icon width={16} height={16} icon="reload" />
          </button>
        </li>

        <li>
          <button>
            <Icon width={24} height={24} icon="plus" />
          </button>
        </li>

        <li>
          <button className="btn-toolbar-stop">
            <Icon width={16} height={16} icon="stop" />
          </button>
        </li>
      </ul>

      {renderKernelInfo()}
    </div>
  );
}
