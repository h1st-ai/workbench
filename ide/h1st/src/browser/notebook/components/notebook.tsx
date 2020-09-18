import * as React from "react";
import URI from "@theia/core/lib/common/uri";

export default function(props: any) {
  const uri: URI = props.uri;
  return <p>This is a notebook: {uri.toString()}</p>;
}
