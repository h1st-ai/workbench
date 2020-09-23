import * as React from "react";
import Icon from "../icon";

export default function Toolbar() {
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
    </div>
  );
}
