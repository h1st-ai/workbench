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

describe("notebook util functions", () => {
  const { expect } = chai;
  let store: EnhancedStore;
  beforeEach(() => {
    store = mockStore({});
  });

  it("one should equal one", () => {
    // assert(1 === 1, "one equals one");
    console.log(store.getState());
    expect(store.getState()).to.eql({});
  });
});
