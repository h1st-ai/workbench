import * as React from "react";
// import fuzzysearch from "fuzzysearch";
// import Editor from "@monaco-editor/react";
// import Editor from "./monaco-editor";
import { useDispatch, useSelector } from "react-redux";
import { CELL_TYPE, IStore } from "../../types";
import { notebookActions } from "../../reducers/notebook";
import NotebookContext from "../../context";

const fuzzysearch = require("fuzzysearch");

// const throttle = require("lodash.throttle");
const debounce = require("lodash.debounce");
const LINE_HEIGHT = 18;

export default function CellInput({ model }: any) {
  let editorHeight: number;

  const dispatch = useDispatch();
  const {
    setActiveCell,
    setCellInput,
    setCurrentCell,
    focusOnCell,
  } = notebookActions;
  const { activeCell, focusedCell } = useSelector(
    (store: IStore) => store.notebook
  );
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>();
  let editorModelId: string; //monaco.editor.ITextModel;

  // const editorWrapper = React.useRef<monaco.editor.IStandaloneCodeEditor>();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const context = React.useContext(NotebookContext);

  const { width } = context;

  // update input width when the widget size change
  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.layout();
    }
  }, [width]);

  // if a focused cell hasbeen request, focus on that cell
  React.useEffect(() => {
    if (focusedCell === model.id) {
      setTimeout(() => {
        console.log(
          "focusing on cell",
          focusedCell,
          model.id,
          editorRef.current
        );
        if (editorRef.current) {
          editorRef.current?.focus();

          // now we have the focus, clear the request
          dispatch(focusOnCell({ cellId: null }));
          context.manager?.scrollTo(`#cell-${model.id}`);
        }
      }, 0);
    }
  }, [focusedCell]);

  React.useEffect(() => {
    if (activeCell === model.id && model.cell_type == CELL_TYPE.MD) {
      // const editor = editorRef.current;

      console.log("focusing cell");
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      }, 0);
    }
  }, [activeCell]);

  // initialize editor
  React.useEffect(() => {
    const createDependencyProposals = debounce(async function(range: any) {
      // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
      // here you could do a server side lookup
      const editor = editorRef.current;

      if (model.cell_type === CELL_TYPE.CODE && editor) {
        const cursorPos = editor?.getPosition();
        // const model = editorRef.current?.getModel();

        if (cursorPos) {
          // console.log("Looking up");
          // const offset = model.getOffsetAt({
          //   lineNumber: cursorPos.lineNumber,
          //   column: cursorPos.column,
          // });
          // console.log("current offset", offset);

          const wordUntilPosition = editor
            ?.getModel()
            ?.getWordAtPosition(cursorPos);

          if (wordUntilPosition) {
            const suggestions = await context.manager?.getAutoCompleteItems(
              // editorRef.current?.getValue(),
              wordUntilPosition.word,
              wordUntilPosition.word.length - 1
            );

            console.log("suggestions", suggestions);

            if (suggestions) {
              return suggestions
                .filter((match) => fuzzysearch(wordUntilPosition.word, match))
                .map((match) => ({
                  label: match,
                  kind: monaco.languages.CompletionItemKind.Variable,
                  documentation: "",
                  insertText: match,
                  range: range,
                }));
            } // endif
          } // end word at position
        }
      }

      return [];
    }, 700);

    monaco.languages.registerCompletionItemProvider("python", {
      provideCompletionItems: async function(editorModel, position) {
        console.log("Models", editorModel.id, editorModelId);
        if (editorModel.id === editorModelId) {
          var word = editorModel.getWordUntilPosition(position);

          console.log("getWordUntilPosition", word);

          var range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          return {
            suggestions: await createDependencyProposals(range),
          };
        }
      },
    });

    if (wrapperRef.current) {
      // monaco.editor.onDidCreateEditor(handleEditorDidMount);

      const editorModel = monaco.editor.createModel(
        model.source.join(""),
        "python"
      );

      editorModel.onDidChangeContent(onDidChangeModelContent);

      editorModelId = editorModel.id;

      // @ts-ignore
      editorRef.current = monaco.editor.create(wrapperRef.current, {
        model: editorModel,
        language: "python",
        ...EDITOR_OPTIONS,
      });

      editorRef.current.onDidBlurEditorText(() => {
        dispatch(setActiveCell({ cellId: null }));
      });

      editorRef.current.onDidFocusEditorText(() => {
        if (model.cell_type === CELL_TYPE.CODE && model.id !== activeCell) {
          dispatch(setCurrentCell({ cellId: model.id }));
        }
      });

      setTimeout(() => {
        updateEditorHeight();
        // updateEditorWidth();
      }, 0);
    }
  }, []);

  function onDidChangeModelContent(ev: any) {
    console.log("onDidChangeModelContent", ev);
    updateEditorHeight();
    updateCellContent();
  }

  // Monaco editor is ready to use
  // function handleEditorDidMount(
  //   monacoEditor: monaco.editor.IStandaloneCodeEditor
  // ) {
  //   console.log(`${model.id} editor did mount`, monacoEditor);
  //   // editorRef.current = monacoEditor;

  //   // if (editorRef.current) {
  //   //   editorRef.current.setValue(model.source.join(""));
  //   // }
  // }

  function updateCellContent() {
    const editor = editorRef.current;

    if (editor) {
      const code = editor.getValue();
      const cellId = model.id;

      console.log("updating cell input");

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

    // console.log(
    //   `${model.id} editor height change detected from ${editorHeight} to ${height}. Updating editor height`,
    //   editor
    // );

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
            {/* <Editor
              language="markdown"
              value=""
              editorDidMount={handleEditorDidMount}
            /> */}
          </div>
        </div>
      );
    }

    return null;
  }

  // function renderCodeInput() {
  //   return (
  //     <Editor
  //       language="python"
  //       // value={model.source.join("")}
  //       value=""
  //       options={{
  //         glyphMargin: true,
  //         wordWrap: "on",
  //         scrollBeyondLastLine: false,
  //         lightbulb: { enabled: true },
  //         fixedOverflowWidgets: true,
  //         automaticLayout: true,
  //         minimap: {
  //           enabled: false,
  //         },
  //         lineNumbers: "off",
  //         scrollbar: {
  //           vertical: "hidden",
  //           horizontal: "hidden",
  //           verticalScrollbarSize: 0,
  //           horizontalScrollbarSize: 0,
  //           alwaysConsumeMouseWheel: false,
  //         },
  //         renderLineHighlight: "none",
  //         highlightActiveIndentGuide: false,
  //         renderIndentGuides: false,
  //         overviewRulerBorder: false,
  //         overviewRulerLanes: 0,
  //         hideCursorInOverviewRuler: true,
  //         folding: false,
  //         occurrencesHighlight: false,
  //         selectionHighlight: false,
  //         lineDecorationsWidth: 0,
  //         contextmenu: false,
  //         matchBrackets: "near",
  //       }}
  //       editorDidMount={handleEditorDidMount}
  //     />
  //   );
  // }

  // function renderCodeInput() {
  //   return <div></div>
  // }

  function renderInput() {
    switch (model.cell_type) {
      case "markdown":
        return renderMarkdownInput();

      case "code":
        return (
          <div className="cell-input-spacing">
            <div
              className="cell-editor-wrapper"
              style={{ height: 300 }}
              ref={wrapperRef}
            >
              {/* {renderCodeInput()} */}
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

const EDITOR_OPTIONS = {
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
};
