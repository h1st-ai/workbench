import * as React from "react";

export const Plain = (props: any) => <pre>{props.data.join("")}</pre>;
Plain.defaultProps = {
  mediaType: "text/plain",
};
