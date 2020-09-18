import * as React from "react";
import URI from "@theia/core/lib/common/uri";
import NotebookSteps from "./step-panel";
import Toolbar from "./toolbar";
// import { notebookActions } from "../reducers/notebook";

const { useEffect } = React;

export default function(props: any) {
  console.log(props.source);
  const uri: URI = props.uri;
  const content = props.source;

  useEffect(() => {
    console.log("test");
    // const { setCells } = notebookActions;
    // const dispatch = useDispatch();

    // dispatch(setCells(props.source.cells));
  });

  return (
    <React.Fragment>
      <NotebookSteps />
      <Toolbar />
      <p>{uri.toString()}</p>
      <p>{JSON.stringify(content, null, 2)}</p>
    </React.Fragment>
  );
}
