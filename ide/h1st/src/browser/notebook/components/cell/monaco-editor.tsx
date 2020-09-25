import * as React from "react";
import Editor from "@monaco-editor/react";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";

// const DEFAULT_OPTIONS = {
//   glyphMargin: true,
//   wordWrap: "on",
//   scrollBeyondLastLine: false,
//   lightbulb: { enabled: true },
//   fixedOverflowWidgets: true,
//   minimap: {
//     enabled: false,
//   },
//   lineNumbers: "off",
//   scrollbar: {
//     vertical: "hidden",
//     horizontal: "hidden",
//     verticalScrollbarSize: 0,
//     horizontalScrollbarSize: 0,
//     alwaysConsumeMouseWheel: false,
//   },
//   renderLineHighlight: "none",
//   highlightActiveIndentGuide: false,
//   renderIndentGuides: false,
//   overviewRulerBorder: false,
//   overviewRulerLanes: 0,
//   hideCursorInOverviewRuler: true,
//   folding: false,
//   occurrencesHighlight: false,
//   selectionHighlight: false,
//   lineDecorationsWidth: 0,
//   contextmenu: false,
//   matchBrackets: "always",
// };

interface IEditorProps {
  options?: monacoEditor.editor.IEditorConstructionOptions;
  editorDidMount: Function;
  language: string;
  value: string;
}

export default function MonacoEditor(props: IEditorProps) {
  const { options, language, value } = props;
  // const {useEffect} = React;

  // useEffect(() => {
  //   effect
  //   return () => {
  //     cleanup
  //   }
  // }, [input])

  function editorDidMount(
    _: any,
    editor: monacoEditor.editor.IStandaloneCodeEditor
  ) {
    if (props.editorDidMount) {
      props.editorDidMount(_, editor);
    }
  }

  return (
    <Editor
      language={language}
      value={value}
      options={{
        ...options,
        glyphMargin: true,
        wordWrap: "on",
        scrollBeyondLastLine: false,
        lightbulb: { enabled: true },
        fixedOverflowWidgets: true,
        automaticLayout: true,
        minimap: {
          enabled: false,
        },
        lineNumbers: "off",
        scrollbar: {
          vertical: "hidden",
          horizontal: "hidden",
          verticalScrollbarSize: 0,
          horizontalScrollbarSize: 0,
          alwaysConsumeMouseWheel: false,
        },
        renderLineHighlight: "none",
        highlightActiveIndentGuide: false,
        renderIndentGuides: false,
        overviewRulerBorder: false,
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        folding: false,
        occurrencesHighlight: false,
        selectionHighlight: false,
        lineDecorationsWidth: 0,
        contextmenu: false,
        matchBrackets: "always",
      }}
      editorDidMount={editorDidMount}
    />
  );
}

// export default class MonacoEditor extends React.Component {
//   constructor(props: IEditorProps) {
//     super(props)
//   }

//   componentDidMount() {}

//   render() {
//     const { options } = this.props;

//     ;
//   }
// }
