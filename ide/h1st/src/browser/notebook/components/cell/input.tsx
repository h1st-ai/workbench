import * as React from "react";
// import Editor from "@monaco-editor/react";
import Editor from "./monaco-editor";
import { useDispatch, useSelector } from "react-redux";
import { CELL_TYPE, IStore } from "../../types";
import { notebookActions } from "../../reducers/notebook";

const LINE_HEIGHT = 18;

export default function CellInput({ model, width, height }: any) {
  const { useRef, useState, useEffect } = React;

  const dispatch = useDispatch();
  const { setActiveCell } = notebookActions;
  const { activeCell } = useSelector((store: IStore) => store.notebook);
  const editorRef = useRef();
  const wrapperRef = useRef<HTMLHeadingElement>(null);
  const [currentLineCount, setCurrentLineCount] = useState(-1);
  const [editor, setEditor] = useState<any>();
  // const [currentWidth, setWidth] = useState(width);
  // const [currentHeight, setHeight] = useState(height);

  useEffect(() => {
    console.log("Initialize window event handler");
    window.addEventListener("resize", updateEditorSize);

    return () => {
      window.removeEventListener("resize", updateEditorSize);
    };
  }, []);

  useEffect(() => {
    setTimeout(updateEditorSize, 0);

    if (activeCell === model.id && model.cell_type == CELL_TYPE.MD) {
      console.log("focusing", model.id, editor);

      if (editor) {
        editor.focus();
      }
    }
  });

  function updateEditorSize() {
    console.log(`Cell ${model.id}: updating editor size`, width);

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

    // updateEditorHeight(editor);
    // TODO update editor width
  }

  // Monaco editor is ready to use
  function handleEditorDidMount(_: any, monacoEditor: any) {
    console.log(`${model.id} editor did mount`, monacoEditor);
    editorRef.current = monacoEditor;
    setEditor(monacoEditor);

    setTimeout(() => {
      updateEditorHeight(monacoEditor);
      updateEditorSize();
    }, 0);

    monacoEditor.onDidChangeModelContent((ev: any) => {
      console.log(ev);
      console.log(monacoEditor.getValue());
      updateEditorHeight(monacoEditor);
    });

    monacoEditor.onDidBlurEditorText((ev: any) => {
      dispatch(setActiveCell({ id: null }));
    });

    monacoEditor.onDidFocusEditorText((ev: any) => {
      if (model.cell_type === CELL_TYPE.CODE) {
        dispatch(setActiveCell({ id: model.id }));
      }
    });

    console.log(dispatch, setActiveCell);

    // editor.onDidFocusEditor(() => {
    //   dispatch(setActiveCell({ id: model.id }));
    // });
  }

  function updateEditorHeight(editor: any) {
    console.log("updating editor height", editor);
    if (!editor) return;

    const editorDomNode = editor.getDomNode();

    if (!editorDomNode) return;

    const container = editorDomNode.getElementsByClassName(
      "view-lines"
    )[0] as HTMLElement;

    const currLineCount = container.childElementCount;
    if (currentLineCount === currLineCount) {
      return;
    }

    // const lineHeight = computeLineHeight(editor);
    // console.log(lineHeight);
    // const contentHeight = editor.getModel().getLineCount() * lineHeight;
    const contentHeight = editor.getContentHeight();
    const { horizontalScrollbarHeight } = editor.getLayoutInfo();
    const height = Math.max(LINE_HEIGHT, contentHeight);

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

    if (container.childElementCount !== currLineCount) {
      updateEditorHeight(editor);
    } else {
      setCurrentLineCount(currLineCount);
    }
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
  // updateEditorSize();

  return renderInput();
}
