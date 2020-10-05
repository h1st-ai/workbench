import {
  CaseReducerActions,
  configureStore,
  createSlice,
  Slice,
} from "@reduxjs/toolkit";
import configureMockStore from "redux-mock-store";

import * as chai from "chai";
import {
  initialState,
  selectCellAndNeighbors,
  selectCell,
  getCellIndex,
  reducers,
} from "./notebook";

const middlewares: any[] = [];
const mockStore = configureMockStore(middlewares);

describe("Notebook store", () => {
  const { expect, assert } = chai;
  let store: any;
  let state: any;

  /**
   * Helper function test
   */
  describe("helper functions", () => {
    const helperState = {
      cells: [
        { id: "cell1" },
        { id: "cell2" },
        { id: "cell3" },
        { id: "cell4" },
        { id: "cell5" },
      ],
    };

    beforeEach(() => {
      store = mockStore(helperState);
      state = store.getState();
    });

    describe("selectCellAndNeighbors", () => {
      it("select from an empty list", () => {
        const result = selectCellAndNeighbors({ cells: [] }, "foo");

        assert(result?.cell === undefined, "cell is undefined");
        assert(result?.next === undefined, "cell is undefined");
        assert(result?.prev === undefined, "cell is undefined");
      });

      it("select non existant cell", () => {
        const result = selectCellAndNeighbors(state, "foo");

        assert(result?.cell === undefined, "cell is undefined");
        assert(result?.next === undefined, "cell is undefined");
        assert(result?.prev === undefined, "cell is undefined");
      });

      it("select first cell and it neighbors", () => {
        const result = selectCellAndNeighbors(state, "cell1");

        expect(result?.cell).to.eql({ id: "cell1" });
        assert(result?.prev === undefined, "prev cell is undefined");
        expect(result?.next).to.eql({ id: "cell2" });
      });

      it("select last cell and it neighbors", () => {
        const result = selectCellAndNeighbors(state, "cell5");

        expect(result?.cell).to.eql({ id: "cell5" });
        assert(result?.next === undefined, "prev cell is undefined");
        expect(result?.prev).to.eql({ id: "cell4" });
      });
    });

    describe("selectCell", () => {
      it("select non existant cell", () => {
        const result = selectCell(state, "foo");

        assert(result === undefined, "cell is undefined");
      });

      it("select correct cell", () => {
        const result = selectCell(state, "cell1");

        expect(result).to.eql({ id: "cell1" });
      });
    });

    describe("getCellIndex", () => {
      it("select non existant cell", () => {
        const result = getCellIndex(state, "foo");

        assert(result === null, "cell is undefined");
      });

      it("select correct cell", () => {
        let result = getCellIndex(state, "cell1");
        assert(result === 0, "first cell is selected");

        result = getCellIndex(state, "cell2");
        assert(result === 1, "second cell is selected");

        result = getCellIndex(state, "cell5");
        assert(result === 4, "last is selected");
      });
    });
  });

  /**
   * Store state test
   */
  describe("state", () => {
    beforeEach(() => {
      store = mockStore(initialState);
      state = store.getState();
    });

    describe("default state", () => {
      it("default state should be initialized correctly", () => {
        console.log();

        expect(state.cells).to.eql([]);
        expect(state.selectedCell).to.eql(null);
        expect(state.activeCell).to.eql(null);
        expect(state.activeTheme).to.eql(null);
        expect(state.focusedCell).to.eql(null);
        expect(state.executionQueue).to.eql([]);
      });
    });
  });

  /**
   * Store state test
   */
  describe("actions", () => {
    let notebookSlice: Slice;
    let notebookActions: CaseReducerActions<any>;

    beforeEach(() => {
      const cells = [
        {
          cell_type: "code",
          execution_count: 1,
          metadata: {},
          outputs: [
            {
              output_type: "execute_result",
              data: {
                "text/plain": "1",
              },
              metadata: {},
              execution_count: 2,
            },
          ],
          source: [" hello1"],
          id: "cell1",
        },
        {
          cell_type: "code",
          execution_count: 2,
          metadata: {},
          outputs: [],
          source: [" hello2"],
          id: "cell2",
        },
        {
          cell_type: "code",
          execution_count: 3,
          metadata: {},
          outputs: [
            {
              output_type: "execute_result",
              data: {
                "text/plain": "1",
              },
              metadata: {},
              execution_count: 82,
            },
          ],
          source: [" hello3"],
          id: "cell3",
        },
        {
          cell_type: "code",
          execution_count: 4,
          metadata: {},
          outputs: [
            {
              output_type: "execute_result",
              data: {
                "text/plain": "1",
              },
              metadata: {},
              execution_count: 82,
            },
          ],
          source: [" hello4"],
          id: "cell4",
        },
      ];

      notebookSlice = createSlice({
        name: "notebook",
        initialState: { ...initialState, cells },
        //@ts-ignore
        reducers,
      });

      store = configureStore({
        reducer: {
          notebook: notebookSlice.reducer,
        },
      });

      state = store.getState();
      notebookActions = notebookSlice.actions;
    });

    it("focusOnCell", () => {
      const { focusOnCell } = notebookActions;
      //@ts-ignore
      store.dispatch(focusOnCell({ cellId: "foo" }));
      state = store.getState();

      expect(state.notebook.focusedCell).to.equal("foo");

      //@ts-ignore
      store.dispatch(focusOnCell({ cellId: "bar" }));
      state = store.getState();

      expect(state.notebook.focusedCell).to.equal("bar");
    });

    it("setSelectedCell", () => {
      const { setSelectedCell } = notebookActions;
      //@ts-ignore
      store.dispatch(setSelectedCell({ cellId: "selectedFoo" }));
      state = store.getState();

      expect(state.notebook.selectedCell).to.equal("selectedFoo");

      //@ts-ignore
      store.dispatch(setSelectedCell({ cellId: "selectedBar" }));
      state = store.getState();

      expect(state.notebook.selectedCell).to.equal("selectedBar");
    });

    it("setCells", () => {
      const { setCells } = notebookActions;

      const cells = [{ id: "foo", source: ["hello"], outputs: ["test\n"] }];
      //@ts-ignore
      store.dispatch(setCells({ cells }));
      state = store.getState();

      expect(state.notebook.cells.length).to.equal(1);
      expect(state.notebook.cells).to.equal(cells);
    });

    it("selectNextCellOf", () => {
      const { selectNextCellOf } = notebookActions;

      //@ts-ignore
      store.dispatch(selectNextCellOf({ cellId: "cell4" }));
      state = store.getState();

      expect(state.notebook.selectedCell).to.equal(null);

      //@ts-ignore
      store.dispatch(selectNextCellOf({ cellId: "cell1" }));
      state = store.getState();
      expect(state.notebook.selectedCell).to.equal("cell2");
    });

    it("selectPrevCellOf", () => {
      const { selectPrevCellOf } = notebookActions;

      //@ts-ignore
      store.dispatch(selectPrevCellOf({ cellId: "cell1" }));
      state = store.getState();

      expect(state.notebook.selectedCell).to.equal(null);

      //@ts-ignore
      store.dispatch(selectPrevCellOf({ cellId: "cell4" }));
      state = store.getState();
      expect(state.notebook.selectedCell).to.equal("cell3");
    });

    it("setActiveCell", () => {
      const { setActiveCell } = notebookActions;

      //@ts-ignore
      store.dispatch(setActiveCell({ cellId: "cell1" }));
      state = store.getState();

      expect(state.notebook.activeCell).to.equal("cell1");

      //@ts-ignore
      store.dispatch(setActiveCell({ cellId: "cell4" }));
      state = store.getState();
      expect(state.notebook.activeCell).to.equal("cell4");
    });

    it("setCurrentCell", () => {
      const { setCurrentCell } = notebookActions;

      //@ts-ignore
      store.dispatch(setCurrentCell({ cellId: "cell1" }));
      state = store.getState();

      expect(state.notebook.activeCell).to.equal("cell1");
      expect(state.notebook.selectedCell).to.equal("cell1");

      //@ts-ignore
      store.dispatch(setCurrentCell({ cellId: "cell4" }));
      state = store.getState();
      expect(state.notebook.activeCell).to.equal("cell4");
      expect(state.notebook.selectedCell).to.equal("cell4");
    });

    it("setActiveTheme", () => {
      const { setActiveTheme } = notebookActions;

      //@ts-ignore
      store.dispatch(setActiveTheme("theme-white"));
      state = store.getState();

      expect(state.notebook.activeTheme).to.equal("theme-white");
    });

    it("setCellInput", () => {
      const { setCellInput } = notebookActions;

      store.dispatch(
        //@ts-ignore
        setCellInput({ cellId: "cell1", code: "hello\nworld\ntest" })
      );
      state = store.getState();

      const cell = state.notebook.cells[0];
      expect(cell.source.length).to.equal(3);
      expect(cell.source[0]).to.equal("hello\n");
      expect(cell.source[1]).to.equal("world\n");
      expect(cell.source[2]).to.equal("test");
    });

    it("setCellType", () => {
      const { setCellType } = notebookActions;

      store.dispatch(
        //@ts-ignore
        setCellType({ cellId: "cell1", type: "markdown" })
      );
      store.dispatch(
        //@ts-ignore
        setCellType({ cellId: "cell4", type: "markdown" })
      );
      state = store.getState();

      expect(state.notebook.cells[0].cell_type).to.equal("markdown");
      expect(state.notebook.cells[3].cell_type).to.equal("markdown");
    });

    it("clearCellOutput", () => {
      const { clearCellOutput } = notebookActions;

      store.dispatch(
        //@ts-ignore
        clearCellOutput({ cellId: "cell1" })
      );
      store.dispatch(
        //@ts-ignore
        clearCellOutput({ cellId: "cell4" })
      );
      state = store.getState();

      expect(state.notebook.cells[0].outputs.length).to.equal(0);
      expect(state.notebook.cells[3].outputs.length).to.equal(0);
    });

    describe("updateCellOutput", () => {
      it("update execution count on message input event", () => {
        const { updateCellOutput } = notebookActions;
        const executionInput = {
          msg_type: "execute_input",
          content: {
            execution_count: 10,
          },
        };

        store.dispatch(
          //@ts-ignore
          updateCellOutput({ cellId: "cell1", output: executionInput })
        );
        state = store.getState();
        expect(state.notebook.cells[0].execution_count).to.equal(10);
      });

      it("update stream content", () => {
        const { updateCellOutput } = notebookActions;
        const stream1 = {
          msg_type: "stream",
          content: {
            name: "stdout",
            text: "foo↵",
          },
        };
        const stream2 = {
          msg_type: "stream",
          content: {
            name: "stdout",
            text: "bar↵",
          },
        };

        store.dispatch(
          //@ts-ignore
          updateCellOutput({ cellId: "cell2", output: stream1 })
        );
        store.dispatch(
          //@ts-ignore
          updateCellOutput({ cellId: "cell2", output: stream2 })
        );

        state = store.getState();
        expect(state.notebook.cells[1].outputs.length).to.equal(1);
        expect(state.notebook.cells[1].outputs[0].text.length).to.equal(2);
        expect(state.notebook.cells[1].outputs[0].text[0]).to.equal("foo↵");
        expect(state.notebook.cells[1].outputs[0].text[1]).to.equal("bar↵");
      });

      it("update error", () => {
        const { updateCellOutput } = notebookActions;
        const errorMessage = {
          content: {
            ename: "NameError",
            evalue: "name 'pasf' is not defined",
            traceback: [
              "[0;31m---------------------------------------------------------------------------[0m",
              "[0;31mNameError[0m                                 Traceback (most recent call last)",
              "[0;32m<ipython-input-113-0389f4a9c9d9>[0m",
              "[0;31mNameError[0m: name 'pasf' is not defined",
            ],
          },
          msg_type: "error",
        };

        store.dispatch(
          //@ts-ignore
          updateCellOutput({ cellId: "cell2", output: errorMessage })
        );

        state = store.getState();
        console.log(state.notebook.cells[1].outputs);
        expect(state.notebook.cells[1].outputs[0].ename).to.equal("NameError");
        expect(state.notebook.cells[1].outputs[0].evalue).to.equal(
          "name 'pasf' is not defined"
        );
        expect(state.notebook.cells[1].outputs[0].traceback.length).to.equal(4);
        expect(state.notebook.cells[1].outputs[0].traceback).to.equal(
          errorMessage.content.traceback
        );
      });
    });
  });
});
