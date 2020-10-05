import * as React from "react";

export const KernelOutputError = (props: any) => {
  const divRef = React.useRef<any>();

  React.useEffect(() => {
    if (divRef && divRef.current) {
      const html = props.data.traceback
        .join("\n")

        .replace(
          /<(.*?)>/g,
          //@ts-ignore
          (a, match) => `&lt;${match}&gt;`
        )
        .replace(
          /\[\d;31m([^[\n]+)/g,
          //@ts-ignore
          (a, match) => `<span class="code-red">${match}</span>`
        )
        .replace(
          /\[[0-9]+;32m([^[\n]+)/g,
          //@ts-ignore
          (a, match) => `<span class="code-green">${match}</span>`
        )
        .replace(
          /\[\d;34m([^[\n]+)/g,
          //@ts-ignore
          (a, match) => `<span class="code-blue">${match}</span>`
        )
        .replace(
          /\[\d;36m([^[\n]+)/g,
          //@ts-ignore
          (a, match) => `<span class="code-teal">${match}</span>`
        )
        .replace(/?\[0m?/g, () => "<span></span>");

      console.log(html);
      divRef.current.innerHTML = `<pre>${props.data.traceback.join(
        "\n"
      )}</pre>`;
    }
  }, [props.data]);

  console.log("props.data.traceback", props.data.traceback);

  return <div ref={divRef} className="output output-error"></div>;
};
