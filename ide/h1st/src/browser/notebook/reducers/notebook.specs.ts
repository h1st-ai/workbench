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
          execution_count: 82,
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
          source: [" hello1"],
          id: "cell1",
        },
        {
          cell_type: "code",
          execution_count: 82,
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
          source: [" hello2"],
          id: "cell2",
        },
        {
          cell_type: "code",
          execution_count: 82,
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
          execution_count: 82,
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
  });
});
