import { EnhancedStore } from "@reduxjs/toolkit";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// describe("notebook util functions", () => {
// let store: any;
// beforeEach(() => {
//   store = mockStore({
//     notebook: {
//       cells: [""],
//     },
//   });
// });
// });
import * as chai from "chai";
import { initialState, selectCellAndNeighbors } from "./notebook";
import { INotebook } from "../types";

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
