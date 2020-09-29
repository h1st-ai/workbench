import * as React from "react";
// import Editor from "@monaco-editor/react";
import Editor from "./monaco-editor";
import { useDispatch, useSelector } from "react-redux";
import { CELL_TYPE, IStore } from "../../types";
import { notebookActions } from "../../reducers/notebook";
import NotebookContext from "../../context";

// const debounce = require("lodash.debounce");
const LINE_HEIGHT = 18;

export default function CellInput({ model, width, height }: any) {
  let editorHeight: number;

  const dispatch = useDispatch();
  const { setActiveCell, setCellInput, setCurrentCell } = notebookActions;
  const { activeCell } = useSelector((store: IStore) => store.notebook);
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const context = React.useContext(NotebookContext);

  // update input width when the widget size change
  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.layout();
    }
  }, [width]);

  React.useEffect(() => {
    if (activeCell === model.id && model.cell_type == CELL_TYPE.MD) {
      // const editor = editorRef.current;

      console.log("focusing cell", editorRef.current);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      }, 0);
    }
  }, [activeCell]);

  // Monaco editor is ready to use
  function handleEditorDidMount(_: any, monacoEditor: any) {
    console.log(`${model.id} editor did mount`, monacoEditor);
    editorRef.current = monacoEditor;

    if (editorRef.current) {
      editorRef.current.setValue(model.source.join(""));
    }

    setTimeout(() => {
      updateEditorHeight();
      // updateEditorWidth();
    }, 0);

    monacoEditor.onDidChangeModelContent(async (ev: any) => {
      updateEditorHeight();
      updateCellContent();

      if (model.cell_type === CELL_TYPE.CODE) {
        const cursorPos = editorRef.current?.getPosition();
        const model = editorRef.current?.getModel();

        if (cursorPos && model) {
          const offset = model.getOffsetAt({
            lineNumber: cursorPos.lineNumber,
            column: cursorPos.column,
          });
          console.log("current offset", offset);

          await context.manager?.getAutoCompleteItems(
            editorRef.current?.getValue(),
            offset
          );
        }
      }
    });

    monacoEditor.onDidBlurEditorText((ev: any) => {
      dispatch(setActiveCell({ id: null }));
    });

    monacoEditor.onDidFocusEditorText((ev: any) => {
      if (model.cell_type === CELL_TYPE.CODE && model.id !== activeCell) {
        dispatch(setCurrentCell({ id: model.id }));
      }
    });
  }

  function updateCellContent() {
    const editor = editorRef.current;

    if (editor) {
      const code = editor.getValue();
      const cellId = model.id;

      console.log("updating cell input", code.split("\n"));

      dispatch(setCellInput({ code, cellId }));
    }
  }

  // function updateEditorWidth() {
  //   if (!width) return;

  //   const editor = editorRef.current;

  //   console.log(
  //     "should width updated",
  //     wrapperRef.current,
  //     width,
  //     editorWidth,
  //     editor
  //   );
  //   if (wrapperRef.current) {
  //     // real width of input = width minus other component width
  //     const inputWidth = Math.max(100, width - 42 - 8 - 32 - 20);
  //     const wrapper = wrapperRef.current;

  //     wrapper.style.width = `${inputWidth}px`;

  //     if (editor && editorWidth !== inputWidth) {
  //       console.log(
  //         `${model.id}: width changed detected. Updating width from`,
  //         inputWidth,
  //         width
  //       );
  //       // alert("width change");
  //       setTimeout(() => {
  //         // editor.layout({ height: editorHeight, width: inputWidth });
  //         // editor.layout();
  //         editorWidth = inputWidth;
  //       }, 0);
  //     }
  //   }
  // }

  function updateEditorHeight() {
    const editor = editorRef.current;
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
    }
  }

  function renderMarkdownInput() {
    if (activeCell === model.id) {
      return (
        <div className="cell-input-spacing">
          <div className="cell-editor-wrapper" ref={wrapperRef}>
            <Editor
              language="markdown"
              value=""
              editorDidMount={handleEditorDidMount}
            />
          </div>
        </div>
      );
    }

    return null;
  }

  function renderCodeInput() {
    return (
      <Editor
        language="python"
        // value={model.source.join("")}
        value=""
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
          matchBrackets: "near",
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
