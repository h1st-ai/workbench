import * as React from "react";
// import fuzzysearch from "fuzzysearch";
// import Editor from "@monaco-editor/react";
// import Editor from "./monaco-editor";
import { useDispatch, useSelector } from "react-redux";
import { CELL_TYPE, IStore } from "../../types";
import { notebookActions } from "../../reducers/notebook";
import NotebookContext from "../../context";
import { NotebookManager } from "../../notebook-manager";
// import { editor } from "monaco-editor";
// import { editor } from "monaco-editor";

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
  const { activeCell, focusedCell, options: editorOptions } = useSelector(
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
          context.manager?.scrollTo(NotebookManager.getDomCellId(model.id));
        }
      }, 0);
    }
  }, [focusedCell]);

  // initialize editor
  React.useEffect(() => {
    if (model.cell_type === CELL_TYPE.CODE) {
      initCodeCellEditor();
    }

    // return () => editorRef.current?.dispose();
  }, [model.cell_type, editorOptions]);

  React.useEffect(() => {
    if (model.cell_type === CELL_TYPE.MD && activeCell === model.id) {
      console.log("initializing markdown editor");
      initMarkdownEditor();
      setTimeout(() => editorRef.current?.focus(), 0);
    }

    // return () => editorRef.current?.dispose();
  }, [activeCell, model.cell_type, editorOptions]);

  function initMarkdownEditor() {
    if (wrapperRef.current) {
      // monaco.editor.onDidCreateEditor(handleEditorDidMount);

      const editorModel = monaco.editor.createModel(
        model.source.join(""),
        "markdown"
      );

      editorModelId = editorModel.id;

      // @ts-ignore
      editorRef.current = monaco.editor.create(wrapperRef.current, {
        ...EDITOR_OPTIONS,
        model: editorModel,
        language: "markdown",
        lineNumbers: editorOptions.showLineNumber ? "on" : "off",
      });

      initEditorEventHandler(editorRef.current);
      initEditorCommands(editorRef.current);

      // update the editor height to match the content
      setTimeout(() => {
        updateEditorHeight();
      }, 0);
    }
  }

  function initCodeCellEditor() {
    const createDependencyProposals = debounce(async function(range: any) {
      // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
      // here you could do a server side lookup
      const editor = editorRef.current;

      if (model.cell_type === CELL_TYPE.CODE && editor) {
        const cursorPos = editor?.getPosition();
        // const model = editorRef.current?.getModel();

        if (cursorPos) {
          const wordUntilPosition = editor
            ?.getModel()
            ?.getWordAtPosition(cursorPos);

          if (wordUntilPosition) {
            const suggestions = await context.manager?.getAutoCompleteItems(
              // editorRef.current?.getValue(),
              // offset
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
    }, 500);

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
      editorRef.current?.dispose();
      // monaco.editor.onDidCreateEditor(handleEditorDidMount);

      const editorModel = monaco.editor.createModel(
        model.source.join(""),
        "python"
      );

      editorModelId = editorModel.id;

      // @ts-ignore
      editorRef.current = monaco.editor.create(wrapperRef.current, {
        ...EDITOR_OPTIONS,
        model: editorModel,
        language: "python",
        lineNumbers: editorOptions.showLineNumber ? "on" : "off",
      });

      initEditorEventHandler(editorRef.current);
      initEditorCommands(editorRef.current);

      // update the editor height to match the content
      setTimeout(() => {
        updateEditorHeight();
      }, 0);
    }
  }

  // bind editor to some events
  function initEditorEventHandler(editor: monaco.editor.IStandaloneCodeEditor) {
    // invoke when text changed inside editor
    editor.getModel()?.onDidChangeContent(() => {
      updateEditorHeight();
      updateCellContent();
    });

    editor.onDidBlurEditorText(() => {
      dispatch(setActiveCell({ cellId: null }));
    });

    editor.onDidFocusEditorText(() => {
      if (model.cell_type === CELL_TYPE.CODE) {
        // if the activeCell flag is not set to the current code, mark this as current aka active and selected
        if (model.id !== activeCell) {
          dispatch(setCurrentCell({ cellId: model.id }));
        }
      }
    });
  }

  /**
   * initialize keyboard shortcuts for codecell
   */
  function initEditorCommands(editor: monaco.editor.IStandaloneCodeEditor) {
    // const cursortReachesTheTop = editor.createContextKey(
    //   /*key name*/ "cursortReachesTheTop",
    //   /*default value*/ false
    // );
    // const cursortReachesTheBottom = editor.createContextKey(
    //   /*key name*/ "cursortReachesTheBottom",
    //   /*default value*/ false
    // );

    // cursortReachesTheBottom.set(false);

    editor.onKeyDown((e) => {
      const caretPosition = editor.getPosition();

      if (e.keyCode === monaco.KeyCode.UpArrow) {
        if (
          caretPosition &&
          caretPosition.column === 1 &&
          caretPosition.lineNumber === 1
          // lastCusor &&
          // lastCusor.column === caretPosition.column &&
          // lastCusor.lineNumber === caretPosition.lineNumber
        ) {
          console.log("focus on the prev cell");
          setTimeout(() => {
            context.manager?.focusPrevCellOf(model.id);
            context.manager?.scrollTo(NotebookManager.getDomCellId(model.id));
          }, 0);
        }
      }

      if (e.keyCode === monaco.KeyCode.DownArrow) {
        const totalLines = editor.getModel()?.getLineCount();

        if (totalLines) {
          const lastCol = editor.getModel()?.getLineMaxColumn(totalLines);

          if (
            caretPosition &&
            caretPosition.column === lastCol &&
            caretPosition.lineNumber === totalLines
            // lastCusor &&
            // lastCusor.column === caretPosition.column &&
            // lastCusor.lineNumber === caretPosition.lineNumber
          ) {
            console.log("focus on the next cell");
            setTimeout(() => {
              context.manager?.focusNextCellOf(model.id);
              context.manager?.scrollTo(NotebookManager.getDomCellId(model.id));
            }, 0);
          }
        }
      }
    });

    if (model.cell_type === CELL_TYPE.CODE) {
      // CmdCtrl + Enter
      editor.addCommand(monaco.KeyMod.CtrlCmd + monaco.KeyCode.Enter, () => {
        // context.manager?.setSelectedCell(model.id);
        context.manager?.addCellsToQueue([model.id]);
        context.manager?.executeQueue();
      });
    }

    // editor.addCommand(
    //   monaco.KeyCode.UpArrow,
    //   () => {
    //     const caretPosition = editor.getPosition();
    //     if (
    //       caretPosition &&
    //       caretPosition.column === 0 &&
    //       caretPosition.lineNumber === 0
    //     ) {
    //       alert("transfer to previous codeCell");
    //     }
    //   },
    //   "cursortReachesTheTop"
    // );

    // editor.addCommand(
    //   monaco.KeyCode.UpArrow,
    //   () => {
    //     const caretPosition = editor.getPosition();
    //     if (
    //       caretPosition &&
    //       caretPosition.column === 0 &&
    //       caretPosition.lineNumber === 0
    //     ) {
    //       alert("transfer to next codeCell");
    //     }
    //   },
    //   "cursortReachesTheBottom"
    // );
  }

  function updateCellContent() {
    const editor = editorRef.current;

    if (editor) {
      const code = editor.getValue();
      const cellId = model.id;

      console.log("updating cell input");

      dispatch(setCellInput({ code, cellId }));
    }
  }

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
            <div className="cell-editor-wrapper" ref={wrapperRef}>
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

const EDITOR_OPTIONS: Partial<monaco.editor.IStandaloneEditorConstructionOptions> = {
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
  highlightActiveIndentGuide: true,
  renderIndentGuides: true,
  overviewRulerBorder: false,
  overviewRulerLanes: 0,
  hideCursorInOverviewRuler: true,
  folding: false,
  occurrencesHighlight: true,
  selectionHighlight: true,
  lineDecorationsWidth: 16,
  contextmenu: false,
  matchBrackets: "always",
};
