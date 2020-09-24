import * as React from "react";
// import Editor from "@monaco-editor/react";
import Editor from "./monaco-editor";
import { useDispatch, useSelector } from "react-redux";
import { CELL_TYPE, IStore } from "../../types";
import { notebookActions } from "../../reducers/notebook";

const LINE_HEIGHT = 18;

export default function CellInput({ model, width, height }: any) {
  const { useRef, useEffect } = React;
  let editor: monaco.editor.IStandaloneCodeEditor;
  let editorHeight: number;

  const dispatch = useDispatch();
  const { setActiveCell } = notebookActions;
  const { activeCell } = useSelector((store: IStore) => store.notebook);
  const editorRef = useRef();
  const wrapperRef = useRef<HTMLHeadingElement>(null);
  // const [currentLineCount, setCurrentLineCount] = useState(-1);
  // const [editorHeight, setEditorHeight] = useState(LINE_HEIGHT);

  useEffect(() => {
    console.log(`${model.id} Initialize window event handler`);
    window.addEventListener("resize", updateEditorWidth);

    return () => {
      window.removeEventListener("resize", updateEditorWidth);
    };
  }, []);

  // if the user double click on a markdown cell, set focus to the
  // editor
  useEffect(() => {
    if (activeCell === model.id && model.cell_type == CELL_TYPE.MD) {
      if (editor) {
        editor.focus();
      }
    }
  });

  // update input width when the widget size change
  useEffect(() => {
    setTimeout(updateEditorWidth, 0);
  }, [width]);

  // Monaco editor is ready to use
  function handleEditorDidMount(_: any, monacoEditor: any) {
    console.log(`${model.id} editor did mount`, monacoEditor);
    editorRef.current = monacoEditor;
    // setEditor(monacoEditor);
    editor = monacoEditor;

    setTimeout(() => {
      updateEditorHeight();
      updateEditorWidth();
    }, 0);

    monacoEditor.onDidChangeModelContent((ev: any) => {
      updateEditorHeight();
    });

    monacoEditor.onDidBlurEditorText((ev: any) => {
      dispatch(setActiveCell({ id: null }));
    });

    monacoEditor.onDidFocusEditorText((ev: any) => {
      if (model.cell_type === CELL_TYPE.CODE) {
        dispatch(setActiveCell({ id: model.id }));
      }
    });
  }

  function updateEditorWidth() {
    if (!width) return;
    console.log(`Cell ${model.id}: updating editor width`, width);

    if (wrapperRef.current) {
      if (width !== wrapperRef.current.offsetWidth) {
        // real width of input = width minus other component width
        const inputWidth = width - 42 - 8 - 32 - 20;
        wrapperRef.current.style.width = `${inputWidth}px`;
        // editor.layout({ inputWidth });

        if (editor) {
          console.log(
            `Cell ${model.id}: width changed detected. Updating width`,
            editor,
            width
          );
          editor.layout();
        }
      }
    }
  }

  function updateEditorHeight() {
    if (!editor) return;

    const editorDomNode = editor.getDomNode();

    if (!editorDomNode) return;

    // const container = editorDomNode.getElementsByClassName(
    //   "view-lines"
    // )[0] as HTMLElement;

    // const currLineCount = container.childElementCount;
    // if (currentLineCount === currLineCount) {
    //   return;
    // }

    // const lineHeight = computeLineHeight(editor);
    // const contentHeight = editor.getModel().getLineCount() * lineHeight;
    const contentHeight = editor.getContentHeight();
    const height = Math.max(LINE_HEIGHT, contentHeight);

    // do nothing if the height has not change
    if (height === editorHeight) return;

    console.log(
      `${model.id} editor height change detected from ${editorHeight} to ${height}. Updating editor height`,
      editor
    );

    if (wrapperRef.current) {
      editorHeight = height;

      wrapperRef.current.style.height = `${height}px`;
      // editor.layout({ width, height });
      editor.layout();
      console.log("Done setting new height", editorHeight);
    }

    // if (container.childElementCount !== currLineCount) {
    //   updateEditorHeight();
    // } else {
    //   setCurrentLineCount(currLineCount);
    // }
  }

  function renderMarkdownInput() {
    if (activeCell === model.id) {
      return (
        <div className="cell-input-spacing">
          <div className="cell-editor-wrapper" ref={wrapperRef}>
            <Editor
              language="markdown"
              value={model.source.join("")}
              editorDidMount={handleEditorDidMount}
            />
          </div>
        </div>
      );
    }

    return null;
  }

  function renderCodeInput() {
    // return <p>{model.source.join("")}</p>;
    return (
      <Editor
        language="python"
        value={model.source.join("")}
        options={{
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
        editorDidMount={handleEditorDidMount}
      />
    );
  }

  function renderInput() {
    switch (model.cell_type) {
      case "markdown":
        return renderMarkdownInput();

      case "code":
        return (
          <div className="cell-input-spacing">
            <div className="cell-editor-wrapper" ref={wrapperRef}>
              {renderCodeInput()}
            </div>
          </div>
        );

      default:
        return <p>{model.source.join("")}</p>;
    }
  }

  // update editor size
  // updateEditorWidth();

  return renderInput();
}
