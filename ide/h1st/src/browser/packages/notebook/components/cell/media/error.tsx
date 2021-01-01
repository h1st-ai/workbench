import * as React from "react";
import Ansi from "ansi-to-react";

export interface IOutputErrorProps {
  data: {
    traceback: string[];
  };
}

export const KernelOutputError = (props: IOutputErrorProps) => {
  // const divRef = React.useRef<any>();

  // React.useEffect(() => {
  //   if (divRef && divRef.current) {
  //     const html = props.data.traceback
  //       .map((m: string) => {
  //         return (
  //           m
  //             .replace(
  //               /<(.*?)>/g,
  //               //@ts-ignore
  //               (a, match) => `&lt;${match}&gt;`
  //             )
  //             .replace(
  //               /\[\d;31m([^[\n]+)/g,
  //               //@ts-ignore
  //               (a, match) => `<span class="code-red">${match}</span>`
  //             )
  //             .replace(
  //               /\[[0-9]+;32m([^[\n]+)/g,
  //               //@ts-ignore
  //               (a, match) => `<span class="code-green">${match}</span>`
  //             )
  //             .replace(
  //               /\[[0-9]+;34m([^[\n]+)/g,
  //               //@ts-ignore
  //               (a, match) => `<span class="code-blue">${match}</span>`
  //             )
  //             .replace(
  //               /\[\d;36m([^[\n]+)/g,
  //               //@ts-ignore
  //               (a, match) => `<span class="code-teal">${match}</span>`
  //             )
  //             // .replace(/ +/g, (m) => (m.length === 1 ? "" : m))
  //             .replace(//g, "")
  //             .replace(/?\[0m?/g, () => "<span></span>")
  //         );
  //       })
  //       .join("\n");

  //     divRef.current.innerHTML = `<div><pre>${html}</pre>`;
  //   }
  // }, [props.data]);

  return (
    <div className="output output-error">
      <pre>
        <Ansi useClasses>{props.data.traceback.join("\n")}</Ansi>
      </pre>
    </div>
  );
};
