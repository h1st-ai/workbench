// import {Markdown} from "@nteract/presentational-components/lib/components/outputs";
import * as React from "react";
import Markdown from "@nteract/outputs/lib/components/media/markdown";
import { ICellOutputProps, IStore } from "../../types";
import { useSelector } from "react-redux";
// import MarkdownRender from '@nteract/markdown'

// import {
//   Input,
//   Prompt,
//   Source,
//   Outputs,
//   Cell,
// } from "@nteract/presentational-components";

export default function CellOuput(props: ICellOutputProps) {
  const { model } = props;
  const { activeCell } = useSelector((store: IStore) => store.notebook);

  function renderMedia() {
    let output;

    switch (model.cell_type) {
      case "markdown":
        if (activeCell !== model.id) {
          output = renderMarkdown(model.source.join(""));
        } else {
          output = null;
        }

        break;

      default:
        output = model.cell_type;
        break;
    }

    return output;
  }

  function renderMarkdown(data: string) {
    return <Markdown data={data} />;
    // return <p>{data}</p>;
    // return <MarkdownRender source={data} />
  }

  return <div className="cell-output-wrapper">{renderMedia()}</div>;
}
