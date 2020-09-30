// import * as React from "react";
// // import Editor from "@monaco-editor/react";

// import { CELL_TYPE, ICellModel, IStore } from "../../types";
// import { useSelector, useDispatch } from "react-redux";
// import { notebookActions } from "../../reducers/notebook";

// const LINE_HEIGHT = 18;

// const EDITOR_OPTIONS = {
//   glyphMargin: true,
//   wordWrap: "on",
//   scrollBeyondLastLine: false,
//   lightbulb: { enabled: true },
//   fixedOverflowWidgets: true,
//   automaticLayout: true,
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

// interface IEditorProps {
//   model: ICellModel;
// }

// export default function MonacoEditor(props: IEditorProps) {
//   const { model } = props;

//   let editorHeight: number;

//   const {
//     setActiveCell,
//     setCellInput,
//     setCurrentCell,
//     focusOnCell,
//   } = notebookActions;

//   const { activeCell, focusedCell } = useSelector(
//     (store: IStore) => store.notebook
//   );

//   // const { activeTheme } = useSelector((store: IStore) => store.notebook);
//   const wrapperRef = React.useRef<HTMLDivElement>(null);
//   const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor>();
//   let editorModelId: string;
//   const dispatch = useDispatch();

//   React.useEffect(() => {
//     if (model.cell_type == CELL_TYPE.MD) {
//       initMarkdownCellEditor();
//     }
//   }, []);

//   function initMarkdownCellEditor() {
//     if (wrapperRef.current) {
//       const editorModel = monaco.editor.createModel(
//         model.source.join(""),
//         "markdown"
//       );

//       editorModel.onDidChangeContent(onDidChangeModelContent);

//       editorModelId = editorModel.id;

//       // @ts-ignore
//       editorRef.current = monaco.editor.create(wrapperRef.current, {
//         model: editorModel,
//         language: "markdown",
//         ...EDITOR_OPTIONS,
//       });

//       editorRef.current.onDidBlurEditorText(() => {
//         dispatch(setActiveCell({ cellId: null }));
//       });

//       editorRef.current.onDidFocusEditorText(() => {
//         if (model.id !== activeCell) {
//           dispatch(setCurrentCell({ cellId: model.id }));
//         }
//       });

//       setTimeout(() => {
//         updateEditorHeight();
//       }, 0);
//     }
//   }

//   function onDidChangeModelContent(ev: any) {
//     console.log("onDidChangeModelContent", ev);
//     updateEditorHeight();
//     updateCellContent();
//   }

//   function updateEditorHeight() {
//     const editor = editorRef.current;
//     if (!editor) return;

//     const editorDomNode = editor.getDomNode();

//     if (!editorDomNode) return;

//     // const container = editorDomNode.getElementsByClassName(
//     //   "view-lines"
//     // )[0] as HTMLElement;

//     // const currLineCount = container.childElementCount;
//     // if (currentLineCount === currLineCount) {
//     //   return;
//     // }

//     // const lineHeight = computeLineHeight(editor);
//     // const contentHeight = editor.getModel().getLineCount() * lineHeight;
//     const contentHeight = editor.getContentHeight();
//     const height = Math.max(LINE_HEIGHT, contentHeight);

//     // do nothing if the height has not change
//     if (height === editorHeight) return;

//     if (wrapperRef.current) {
//       editorHeight = height;

//       wrapperRef.current.style.height = `${height}px`;
//       // editor.layout({ width, height });
//       editor.layout();
//     }
//   }

//   return <div ref={wrapperRef}></div>;

//   // return (
//   //   <Editor
//   //     language={language}
//   //     value={value}
//   //     theme={activeTheme?.editorTheme}
//   //     options={{
//   //       ...options,
//   //       glyphMargin: true,
//   //       wordWrap: "on",
//   //       scrollBeyondLastLine: false,
//   //       lightbulb: { enabled: true },
//   //       fixedOverflowWidgets: true,
//   //       automaticLayout: true,
//   //       minimap: {
//   //         enabled: false,
//   //       },
//   //       lineNumbers: "off",
//   //       scrollbar: {
//   //         vertical: "hidden",
//   //         horizontal: "hidden",
//   //         verticalScrollbarSize: 0,
//   //         horizontalScrollbarSize: 0,
//   //         alwaysConsumeMouseWheel: false,
//   //       },
//   //       renderLineHighlight: "none",
//   //       highlightActiveIndentGuide: false,
//   //       renderIndentGuides: false,
//   //       overviewRulerBorder: false,
//   //       overviewRulerLanes: 0,
//   //       hideCursorInOverviewRuler: true,
//   //       folding: false,
//   //       occurrencesHighlight: false,
//   //       selectionHighlight: false,
//   //       lineDecorationsWidth: 0,
//   //       contextmenu: false,
//   //       matchBrackets: "always",
//   //     }}
//   //     editorDidMount={editorDidMount}
//   //   />
//   // );
// }

// // export default class MonacoEditor extends React.Component {
// //   constructor(props: IEditorProps) {
// //     super(props)
// //   }

// //   componentDidMount() {}

// //   render() {
// //     const { options } = this.props;

// //     ;
// //   }
// // }
