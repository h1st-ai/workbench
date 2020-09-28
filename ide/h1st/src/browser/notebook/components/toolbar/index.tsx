import * as React from "react";
import Icon from "../icon";
import { useSelector } from "react-redux";
import { IStore } from "../../types";

export default function Toolbar() {
  const { currentKernel, status } = useSelector(
    (store: IStore) => store.kernel
  );

  function renderKernelInfo() {
    if (currentKernel) {
      return (
        <div className="kernel-info-wrapper">
          <span>Kernel: {currentKernel.display_name}</span> |{" "}
          <span>Status: {status}</span>
        </div>
      );
    }
  }

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
          <button>
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
