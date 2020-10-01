import { EnhancedStore } from "@reduxjs/toolkit";
import configureMockStore from "redux-mock-store";

import * as chai from "chai";
import { initialState, selectCellAndNeighbors, selectCell } from "./notebook";
import { INotebook } from "../types";

const middlewares: any[] = [];
const mockStore = configureMockStore(middlewares);

describe("notebook store", () => {
  const { expect, assert } = chai;
  let store: EnhancedStore;
  let state: INotebook;

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
  });

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
});
