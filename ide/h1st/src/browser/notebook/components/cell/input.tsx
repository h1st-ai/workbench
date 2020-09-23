import * as React from "react";
import Editor from "@monaco-editor/react";
import { useDispatch, useSelector } from "react-redux";
import { IStore } from "../../types";
import { notebookActions } from "../../reducers/notebook";

// let lastResizedLineCount = 0;

export default function CellInput({ model }: any) {
  const { useRef } = React;

  const dispatch = useDispatch();
  const { setActiveCell } = notebookActions;
  const { activeCell } = useSelector((store: IStore) => store.notebook);
  const editorRef = useRef();
  const wrapperRef = useRef<HTMLHeadingElement>(null);

  function handleEditorDidMount(_: any, editor: any) {
    editorRef.current = editor;
    // updateEditorHeight(editor);

    // Now you can use the instance of monaco editor
    // in this component whenever you want
    editor.onDidChangeModelContent((ev: any) => {
      console.log(ev);
      console.log(editor.getValue());
      updateEditorHeight(editor);
    });

    console.log(dispatch, setActiveCell);
    console.log(editor);
    // editor.onDidFocusEditor(() => {
    //   dispatch(setActiveCell({ id: model.id }));
    // });
  }

  function updateEditorHeight(editor: any) {
    // let lineCount = editor.getModel().getLineCount();
    // Do not invalidate layout if the line count hasn't changed, as this method
    // will be called for every keypress and layouts are too expensive.
    // if (lineCount == lastResizedLineCount) {
    //   return;
    // }
    // lastResizedLineCount = lineCount;

    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
    const contentHeight = Math.min(lineHeight, editor.getContentHeight());

    const { horizontalScrollbarHeight, width } = editor.getLayoutInfo();
    const height = contentHeight + horizontalScrollbarHeight;

    console.log(
      "updating height",
      editor,
      activeCell,
      editor.getLayoutInfo(),
      contentHeight,
      horizontalScrollbarHeight,
      height
    );

    if (wrapperRef.current) {
      wrapperRef.current.style.height = `${height}px`;
      editor.layout({ width, height });
    }
  }

  function renderMarkdownInput() {
    return (
      <Editor
        // height={200}
        language="markdown"
        value={model.source.join("")}
        options={{
          isSimpleWidget: true,
          glyphMargin: false,
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
          matchBrackets: false,
        }}
        editorDidMount={handleEditorDidMount}
      />
    );
  }

  function renderInput() {
    switch (model.cell_type) {
      case "markdown":
        return renderMarkdownInput();

      default:
        return null;
    }
  }

  return (
    <div className="cell-editor-wrapper" ref={wrapperRef}>
      {renderInput()}
    </div>
  );
}
