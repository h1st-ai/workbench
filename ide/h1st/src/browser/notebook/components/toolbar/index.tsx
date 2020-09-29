import * as React from "react";
import Icon from "../icon";
import { useSelector } from "react-redux";
import { IStore } from "../../types";
import NotebookContext from "../../context";

function KernelStatus() {
  const { status } = useSelector((store: IStore) => store.kernel);

  return <span className={`kernel-status ${status}`}>{status}</span>;
}

function ConnectIcon() {
  const { connectionStatus } = useSelector((store: IStore) => store.kernel);
  let icon;

  switch (connectionStatus) {
    case "connecting":
      icon = <Icon icon="connecting" width={24} height={24} />;
      break;

    default:
      icon = <Icon icon={connectionStatus} width={16} height={16} />;
      break;
  }

  return <span className={`connection-icon ${connectionStatus}`}>{icon}</span>;
}

function JupyterServer() {
  return (
    <div>
      <ConnectIcon />
      <span>Jupyter server: local</span>
    </div>
  );
}

function JupyterKernel() {
  const { currentKernel } = useSelector((store: IStore) => store.kernel);

  return (
    currentKernel && (
      <div>
        {currentKernel.display_name}: <KernelStatus />
      </div>
    )
  );
}

export default function Toolbar() {
  const context = React.useContext(NotebookContext);
  const { selectedCell } = useSelector((store: IStore) => store.notebook);

  const doRestartKernel = async (ev: any) => {
    await context.manager?.restartKernel();
  };

  const executeAll = async () => {
    await context.manager?.executeCells(0);
  };

  const executeAfter = async () => {
    //@ts-ignore
    await context.manager?.executeCells(selectedCell);
  };

  const interruptKernel = async () => {
    await context.manager?.interrupKernel();
  };

  return (
    <div className="toolbar">
      <ul>
        <li>
          <button onClick={executeAll}>
            <Icon width={16} height={16} icon="fast-forward" />
          </button>
        </li>
        <li>
          <button disabled={!selectedCell} onClick={executeAfter}>
            <Icon width={16} height={16} icon="play-down" />
          </button>
        </li>

        <li>
          <button onClick={doRestartKernel}>
            <Icon width={16} height={16} icon="reload" />
          </button>
        </li>

        <li>
          <button className="btn-toolbar-stop" onClick={interruptKernel}>
            <Icon width={16} height={16} icon="stop" />
          </button>
        </li>

        <li>
          <button>
            <Icon width={24} height={24} icon="plus" />
          </button>
        </li>

        <li>
          <button>
            <Icon width={24} height={24} icon="cell-clear" />
          </button>
        </li>
      </ul>

      <div className="kernel-info-wrapper">
        <JupyterServer />
        <JupyterKernel />
      </div>
    </div>
  );
}
